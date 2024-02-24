// // Drawing Mesh
// // Detection
// export const drawMesh = (predictions, ctx) => {
//   console.log(Object.keys(predictions))
//   // var emo = emotions['emotion']
//   if (Object.keys(predictions).length > 0) {
//     console.log("trying to read")
//   console.log(predictions)
//       for (let key in Object.keys(predictions)) {
//         // const start = predictions[i];
//         // const end = predictions[i];
//         // const size = [end[0] - start[0], end[1] - start[1]];
//         var coordinates = predictions[key]["coordinates"]
//         var className = predictions[key]["cls"]
//         var color = predictions[key]["color"]
//         const start = [coordinates[0], coordinates[1]];
//         const end =  [coordinates[2], coordinates[3]];
//         const size = [end[0] - start[0], end[1] - start[1]];
  
//         // Render a rectangle over each detected face.
//         ctx.beginPath();
//         ctx.lineWidth = "8";
//           // ctx.fillStyle = 'green';
//         // if (emo==='angry'){
//         //   ctx.fillStyle = 'red';
//         // }
//         // else if (emo==='neutral'){
//         //   ctx.fillStyle = 'green';
//         // }
//         // else if (emo==='happy'){
//         //   ctx.fillStyle = 'orange';
//         // }
//         // else if (emo==='fear'){
//         //   ctx.fillStyle = 'blue';
//         // }
//         // else if (emo==='surprise'){
//         //   ctx.fillStyle = 'yellow';
//         // }
//         // else if (emo==='sad'){
//         //   ctx.fillStyle = 'gray';
//         // }
//         // else {
//         //   ctx.fillStyle = 'pink';
//         // }
//         console.log(color)
//         ctx.fillStyle = `rgb(${color[0]}, ${color[1]}, ${color[2]})`;
//         ctx.globalAlpha = 0.2;
//         ctx.rect(start[0], start[1], size[0], size[1]);
//         // ctx.fillRect(start[0], start[1], size[0], size[1]);
//         ctx.strokeStyle = `rgb(${color[0]}, ${color[1]}, ${color[2]})`;
//         ctx.stroke();
//         ctx.font="20px Georgia";
//         ctx.textAlign="center"; 
//         ctx.textBaseline = "middle";
//         ctx.fillStyle = "#000000";
//         ctx.fillText(className, start[0]+40, start[1]+15);
//         }
//     }
//   };

// Drawing Mesh
// Emotions
export const drawMesh = (predictions, ctx) => {
  console.log("Predictions")
  console.log(predictions)
  console.log(Object.keys(predictions))
  // var emo = emotions['emotion']
  if (Object.keys(predictions).length > 0) {
    console.log("trying to read")
  console.log(predictions)
      // for (let key in Object.keys(predictions)) {
        // const start = predictions[i];
        // const end = predictions[i];
        // const size = [end[0] - start[0], end[1] - start[1]];
        console.log(predictions)
        var coordinates = predictions["box"]
        var emo = predictions["emotion"]
        // var color = predictions[key]["color"]
        const start = [coordinates[0], coordinates[1]];
        const end =  [coordinates[2], coordinates[3]];
        const size = [end[0], end[1]];
  
        // Render a rectangle over each detected face.
        ctx.beginPath();
        ctx.lineWidth = "3";
          ctx.fillStyle = 'green';
        if (emo==='angry'){
          ctx.fillStyle = 'red';
        }
        else if (emo==='neutral'){
          ctx.fillStyle = 'green';
        }
        else if (emo==='happy'){
          ctx.fillStyle = 'orange';
        }
        else if (emo==='fear'){
          ctx.fillStyle = 'blue';
        }
        else if (emo==='surprise'){
          ctx.fillStyle = 'yellow';
        }
        else if (emo==='sad'){
          ctx.fillStyle = 'gray';
        }
        else {
          ctx.fillStyle = 'pink';
        }
        // console.log(color)
        // ctx.fillStyle = `rgb(${color[0]}, ${color[1]}, ${color[2]})`;
        ctx.globalAlpha = 0.2;
        ctx.rect(start[0], start[1], size[0], size[1]);
        ctx.fillRect(start[0], start[1], size[0], size[1]);
        // ctx.strokeStyle = `rgb(${color[0]}, ${color[1]}, ${color[2]})`;
        ctx.stroke();
        ctx.font="20px Georgia";
        ctx.textAlign="center"; 
        ctx.textBaseline = "middle";
        ctx.fillStyle = "#000000";
        ctx.fillText(emo, start[0]+40, start[1]+15);
        // }
    }
  };