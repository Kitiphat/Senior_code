import torch
import pandas as pd
import re
import six
import sentencepiece as spm
import collections
import unicodedata
import pickle
import random
from torch.nn.utils.rnn import pad_sequence
from simpletransformers.ner import NERModel, NERArgs
from transformers import BertForSequenceClassification, PreTrainedTokenizerFast
from bert.bpe_helper import BPE
from pythainlp.tokenize import subword_tokenize
from pythainlp import word_tokenize

class ThaiTokenizer(object):
    """Tokenizes Thai texts."""

    def __init__(self, vocab_file, spm_file):
        self.vocab = self.load_vocab(vocab_file)
        self.inv_vocab = {v: k for k, v in self.vocab.items()}

        self.bpe = BPE(vocab_file)
        self.s = spm.SentencePieceProcessor()
        self.s.Load(spm_file)

    def tokenize(self, text):
        bpe_tokens = self.bpe.encode(text).split(' ')
        spm_tokens = self.s.EncodeAsPieces(text)

        tokens = bpe_tokens if len(bpe_tokens) < len(spm_tokens) else spm_tokens

        split_tokens = []

        for token in tokens:
            new_token = token

            if token.startswith('_') and not token in self.vocab:
                split_tokens.append('_')
                new_token = token[1:]

            if not new_token in self.vocab:
                split_tokens.append('<unk>')
            else:
                split_tokens.append(new_token)

        return split_tokens

    def convert_tokens_to_ids(self, tokens):
        return self.convert_by_vocab(self.vocab, tokens)

    def convert_ids_to_tokens(self, ids):
        return self.convert_by_vocab(self.inv_vocab, ids)
  
    def load_vocab(self, vocab_file):
        vocab = collections.OrderedDict()
        index = 0
        with open(vocab_file, "r", encoding="utf-8") as reader:
            while True:
                token = reader.readline()
                if token.split(): token = token.split()[0] # to support SentencePiece vocab file
                token = self.convert_to_unicode(token)
                if not token:
                    break
                token = token.strip()
                vocab[token] = index
                index += 1
        return vocab

    def convert_by_vocab(self, vocab, items):
        output = []
        for item in items:
            output.append(vocab[item])
        return output

    def convert_to_unicode(self, text):
        """Converts `text` to Unicode (if it's not already), assuming utf-8 input."""
        if six.PY3:
            if isinstance(text, str):
                return text
            elif isinstance(text, bytes):
                return text.decode("utf-8", "ignore")
            else:
                raise ValueError("Unsupported string type: %s" % (type(text)))
        elif six.PY2:
            if isinstance(text, str):
                return text.decode("utf-8", "ignore")
            elif isinstance(text, unicode):
                return text
            else:
                raise ValueError("Unsupported string type: %s" % (type(text)))
        else:
            raise ValueError("Not running on Python2 or Python 3?")

class ChatbotModel:
    def __init__(self):
        # Load the NER model
        ner_args = NERArgs()
        ner_args.evaluate_during_training = True
        ner_args.overwrite_output_dir = True
        self.ner_model = NERModel("camembert", "C:/Users/Koptorinw/Documents/GitHub/TPR/Senior_code/chatbot/data/ner_model", args=ner_args, use_cuda=torch.cuda.is_available(), labels=["O", "B-LOCATION", "I-LOCATION"])

        # Load the fine-tuned BERT model for sequence classification
        self.text_model = BertForSequenceClassification.from_pretrained('C:/Users/Koptorinw/Documents/GitHub/TPR/Senior_code/chatbot/data/text_model')
        self.tokenizer = ThaiTokenizer(vocab_file='C:/Users/Koptorinw/Documents/GitHub/TPR/Senior_code/chatbot/data/th.wiki.bpe.op25000.vocab', 
                                       spm_file='C:/Users/Koptorinw/Documents/GitHub/TPR/Senior_code/chatbot/data/th.wiki.bpe.op25000.model')
        self.actual_labels = ['all_contract', 'recom_info', 'utility', 'history', 'place_data', 'place_name', ' place_type', 'more_data', 'facility', 'activity', 'address', 'type', 'all_day_time', 'feature']
        self.df = pd.read_json('C:/Users/Koptorinw/Documents/GitHub/TPR/Senior_code/chatbot/data/travel_place_data.json')
        self.value_empty = {"address": "ที่อยู่",
                       "all_day_time": "เวลาทำการ",
                       "all_contract": "ข้อมูลติดต่อ",
                       "place_data": "ข้อมูลเบื้องต้น",
                       "place_type": "ประเภทแหล่งท่องเที่ยว",
                       "feature": "ลักษณะเด่นหรือจุดเด่น",
                       "history": "ประวัติ",
                       "more_data": "ข้อมูลเพิ่มเติม",
                       "recom_info": "ข้อมูลแนะนำ",
                       "facility": "สิ่งอำนวยความสะดวก",
                       "utility": "สาธารณูปโภค",
                       "activity": "กิจกรรมท่องเที่ยว"}

    def extract_location_entities(self, text):
        word_tokens = subword_tokenize(text, engine="wangchanberta")
        sentence = " ".join(word_tokens)
        predictions, raw_outputs = self.ner_model.predict([sentence.replace('▁', ' ').replace('้ํา', '้ำ').replace('ํา', 'ำ')])
        p_location = []  # Prefix of the place name
        f_location = []  # Full place name
        current_location_start = None  # Variable to keep track of the start of the current LOCATION
        current_location = None  # Variable to keep track of the current LOCATION
        location = False  # Initialize location

        for i in range(len(predictions[0])):
            for key, value in predictions[0][i].items():
                if "LOCATION" in value:
                    if value == "B-LOCATION":  # Initial name of location
                        current_location_start = key
                        current_location = key
                        p_location.append(current_location_start)
                    elif value == "I-LOCATION" and current_location_start:  # Create the full name of the location
                        location = True
                        current_location += key
                if location and (value == "B-LOCATION" or value == "O" or i == len(predictions[0]) - 1):
                    f_location.append(current_location)
                    location = False
                if value == "O":  # not a location
                    current_location_start = None

        return p_location, f_location

    def predict_labels(self, question, threshold=0.5):
        # Tokenize the question
        tokenized_question = self.tokenizer.tokenize(question)

        # Convert tokens to token IDs
        token_ids = self.tokenizer.convert_tokens_to_ids(tokenized_question)

        # Pad or truncate the tokenized question to the specified maximum length
        max_seq_length = 40  # Adjust this value based on your requirements
        padded_token_ids = pad_sequence([torch.tensor(token_ids[:max_seq_length])], batch_first=True, padding_value=0)

        # Convert the list of token IDs to a PyTorch tensor
        token_ids_tensor = torch.tensor(padded_token_ids).clone().detach()

        # Predict labels
        with torch.no_grad():
            outputs = self.text_model(token_ids_tensor)
            logits = outputs.logits
            predictions = (torch.sigmoid(logits) > threshold).int().numpy().tolist()[0]

        # Convert predictions to labels (consider thresholding or other strategies)
        predicted_labels = [label for i, label in enumerate(self.actual_labels) if predictions[i] > threshold]

        return predicted_labels

    def process_text_input(self, location_list, text_input):
        # Extract location entities
        p_location, f_location = self.extract_location_entities(text_input)  # Prefix of the place name, Full place name
        next_location = set()  # Store all place names in each question.

        # Predict labels
        predict_label = self.predict_labels(text_input)
        
        # Use isin method to check if columns exist in the DataFrame
        matching_column = self.df.columns.isin(predict_label + ["img"])
        if matching_column[0] == False: # matching_column There is no place_name in the question.
            matching_column[0] = True

        similar_location = pd.DataFrame()   # Initialize similar_location DataFrame
        answer = pd.DataFrame()  # Initialize answer DataFrame

        img_list = []  # List to store image URL

        if len(f_location) != 0:
            for location in f_location:
                similar_location = pd.concat([similar_location, self.df[self.df['place_name'].str.contains(re.escape(location), na=False)]], ignore_index=True)
                answer = similar_location[similar_location.columns[matching_column]]  # Get the columns that match the specified labels
            for ans_place in answer['place_name']:
                next_location.add(ans_place)

        elif len(p_location) != 0:
            for location in p_location:
                similar_location = pd.concat([similar_location, self.df[self.df['place_name'].str.contains(re.escape(location), na=False)]], ignore_index=True)
                if not self.df[self.df['place_name'].str.contains(re.escape(location), na=False)].empty:
                    sample_size = min(5, len(similar_location))  # Adjust sample size based on available rows
                    similar_location = similar_location.sample(n=sample_size, replace=False).reset_index(drop=True)  # Sample without replacement
                answer = similar_location[similar_location.columns[matching_column]]  # Get the columns that match the specified labels
            for ans_place in answer['place_name']:
                next_location.add(ans_place)

        elif "type" in predict_label:
            similar_location = self.df.sample(n=5).reset_index(drop=True)
            answer = similar_location[similar_location.columns[matching_column]]
            for ans_place in answer['place_name']:
                next_location.add(ans_place)

        elif location_list and predict_label:
            for location in location_list:
                similar_location = pd.concat([similar_location, self.df[self.df['place_name'].str.contains(re.escape(location), na=False)]], ignore_index=True)
                answer = similar_location[similar_location.columns[matching_column]]  # Get the columns that match the specified labels
            for ans_place in answer['place_name']:
                next_location.add(ans_place)

        next_location = list(next_location)  # Convert set back to list

        # Loop through each location in similar_location
        for index, row in similar_location.iterrows():
            img_url = row['img']
            img_list.append(img_url)

        print("f_location:", f_location)
        print("p_location:", p_location)
        print("matching_column:", matching_column)
        print("predict_label:", predict_label)
        print("next_location:", next_location)
        print("img_list: ", img_list)

        return answer, predict_label, next_location, img_list

    def format_result(self, answer):
        result = ""
        for index, row in answer.iterrows():
            indented_values = []
            for col, value in zip(answer.columns, row):
                if value == "":
                    indented_values.append(f"ฉันไม่มีข้อมูลเกี่ยวกับ{self.value_empty[col]}ของสถานที่นี้")
                else:
                    indented_values.append(f"{value}")

            result += f"{index+1}. " + '\n'.join(indented_values) + "\n\n"

        # Remove '\n' from the end if there is no indented value attached.
        if result.rstrip('\n\n') == '':
            return "ขออภัยครับ/ค่ะ ฉันไม่เข้าใจคำถาม เนื่องจากข้อมูลล่าสุดที่ฉันมีไม่ได้รับการระบุ โดยชุดข้อมูลของฉันถูกปรับปรุงล่าสุดเมื่อพฤษภาคม 2024"
        else:
            return result.rstrip('\n\n')

    def create_prompt(self, predict_label, location_list):
        value_label = []
        for key, value in self.value_empty.items():
            if key not in predict_label:
                value_label.append(value)

        prompts = []
        for location in location_list:
            for label in value_label:
                prompts.append(f"ช่วยบอก{label}ของ{location}")

        print("prompts:", prompts)
        prompts = random.sample(prompts, min(5, len(prompts)))
        
        return prompts

# # Save the tag for the next location.
# location_list = []

# while True:
#     text_input = input("Enter your question text (type 'end' to finish): ")
#     if text_input.lower() == 'end':
#         break

#     chatbot_model = ChatbotModel()
#     answer, predict_label, next_location, img_list = chatbot_model.process_text_input(location_list, text_input)
#     location_list = next_location

#     result = chatbot_model.format_result(answer)
#     print("Answer: \n", result)
#     print("****************************************************")