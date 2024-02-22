import json
import math
import os
import random
import sys
import time

import torch
from PIL import Image
from ultralytics import YOLO
from torchvision.transforms import Compose, Normalize, Resize, ToTensor
from torchvision.models import resnet18, ResNet18_Weights
from torchvision.models import resnet152, ResNet152_Weights

yolo_model = YOLO("resources/yolov8n.pt")
yolo_mapping = {0: 'person', 1: 'bicycle', 2: 'car', 3: 'motorcycle', 4: 'airplane', 5: 'bus', 6: 'train', 7: 'truck',
                8: 'boat', 9: 'traffic light', 10: 'fire hydrant', 11: 'stop sign', 12: 'parking meter', 13: 'bench',
                14: 'bird', 15: 'cat', 16: 'dog', 17: 'horse', 18: 'sheep', 19: 'cow', 20: 'elephant', 21: 'bear',
                22: 'zebra', 23: 'giraffe', 24: 'backpack', 25: 'umbrella', 26: 'handbag', 27: 'tie', 28: 'suitcase',
                29: 'frisbee', 30: 'skis', 31: 'snowboard', 32: 'sports ball', 33: 'kite', 34: 'baseball bat',
                35: 'baseball glove', 36: 'skateboard', 37: 'surfboard', 38: 'tennis racket', 39: 'bottle',
                40: 'wine glass', 41: 'cup', 42: 'fork', 43: 'knife', 44: 'spoon', 45: 'bowl', 46: 'banana',
                47: 'apple', 48: 'sandwich', 49: 'orange', 50: 'broccoli', 51: 'carrot', 52: 'hot dog', 53: 'pizza',
                54: 'donut', 55: 'cake', 56: 'chair', 57: 'couch', 58: 'potted plant', 59: 'bed', 60: 'dining table',
                61: 'toilet', 62: 'tv', 63: 'laptop', 64: 'mouse', 65: 'remote', 66: 'keyboard', 67: 'cell phone',
                68: 'microwave', 69: 'oven', 70: 'toaster', 71: 'sink', 72: 'refrigerator', 73: 'book', 74: 'clock',
                75: 'vase', 76: 'scissors', 77: 'teddy bear', 78: 'hair drier', 79: 'toothbrush'}


def get_bbox_prediction(image, debug=False):
    yolo_results = yolo_model.predict(image, verbose=debug)
    structured_result = {}

    boxes_info = yolo_results[0].boxes
    for idx, cls_prediction in enumerate(boxes_info.cls):
        bbox_info = {
            "cls": yolo_mapping[int(cls_prediction.item())],
            "conf": round(boxes_info.conf[idx].item(), 2),
            "coordinates": boxes_info.xyxy[idx].tolist()
        }
        structured_result[idx] = bbox_info

    return structured_result


if __name__ == "__main__":

    img = Image.open(os.path.join(os.path.dirname(__file__), "imageToSave.png"))
    results = get_bbox_prediction(img, debug=True)

    print(json.dumps(results, indent=4))
