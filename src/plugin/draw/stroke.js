let HanziWriter = require('./hanzi-writer');

// option = {
//     currentColor: '#f44',
//     showOutline: true,
//     outlineColor
//     padding: true,
//     line: true,
//     lineCross: true,
//     radicalColor: null,
//     strokeColor: '#555',
// }
function stroke (writer, cloneSvg) {
    writer.text.forEach((s) => {
        let target = document.createElement('div');
        writer.el.appendChild(target);
        HanziWriter.loadCharacterData(s).then(function (charData) {
            for (var i = 0; i < charData.strokes.length; i++) {
                renderFanningStrokes({
                    option: writer.option,
                    target,
                    strokes: charData.strokes,
                    current: i,
                    cloneSvg,
                    width: writer.option.width
                });
            }
        });
    });
}


function renderFanningStrokes ({option, target, strokes, cloneSvg, current, width}) {
    var svg = cloneSvg();
    target.appendChild(svg);
    var group = document.createElementNS('http://www.w3.org/2000/svg', 'g');
  
    // set the transform property on the g element so the character renders at 75x75
    var transformData = HanziWriter.getScalingTransform(width, width);
    group.setAttributeNS(null, 'transform', transformData.transform);
    svg.appendChild(group);
    for (let i = 0; i <= current; i++) {
        let color = (i === current && option.currentColor) ? option.currentColor : option.strokeColor;
        renderPath(strokes[i], group, color);
    }
    if (option.showOutline && current + 1 <= strokes.length) {
        for (let i = current + 1; i < strokes.length; i++) {
            renderPath(strokes[i], group, option.outlineColor);
        }
    }
}

function renderPath (strokePath, group, color) {
    var path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    path.setAttributeNS(null, 'd', strokePath);
    // style the character paths
    path.style.fill = color;
    group.appendChild(path);
}

module.exports = {stroke};