from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from fastapi.responses import HTMLResponse
from draw import draw, add_bounding_boxes
from computer_vision.classification import get_clf_prediction
from computer_vision.detection import get_bbox_prediction
from PIL import Image
import numpy as np
import pybase64
import base64
import io

app = FastAPI()


class ConnectionManager:
    def __init__(self):
        self.active_connections = []

    async def connect(self, websocket: WebSocket):
        await websocket.accept()
        self.active_connections.append(websocket)

    def disconnect(self, websocket: WebSocket):
        self.active_connections.remove(websocket)

    async def send_text(self, message: str, websocket: WebSocket):
        await websocket.send_text(message)

    async def send_json(self, message: dict, websocket: WebSocket):
        await websocket.send_json(message)


manager = ConnectionManager()


@app.get("/")
async def get():
    return {200: "OK"}


@app.websocket("/ws/{client_id}")
async def websocket_endpoint(websocket: WebSocket, client_id: int):
    await manager.connect(websocket)
    try:
        while True:
            data = await websocket.receive()
            _, raw = data.get("text").split(",")

            # img = Image.open(io.BytesIO(base64.b64decode(raw)))
            # clf_prediction = get_clf_prediction(img)

            img = Image.open(io.BytesIO(base64.b64decode(raw)))
            yolo_prediction = get_bbox_prediction(img)

            # with open("computer_vision/imageToSave.png", "wb") as fh:
            #     fh.write(pybase64.b64decode((raw)))
            # print(type(img))
            # result = draw(img)
            # result = Image.fromarray(result)
            #
            # result = add_bounding_boxes(img)
            # result = base64.b64encode(result)
            # print(result)

            # imgByteArr = io.BytesIO()
            # result.save(imgByteArr, format="PNG")
            # imgByteArr = base64.b64encode(imgByteArr.getvalue())
            # print(imgByteArr)

            # print((base64.b64encode(result)))
            # result = result()
            # print(raw)

            await manager.send_json(yolo_prediction, websocket)
    except WebSocketDisconnect:
        manager.disconnect(websocket)
