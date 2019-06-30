var options = [
  "100€", "1/2", "10€", "25€", "125€", "Pierde Turno", "75€", "x2", "200€", "Quiebra", "500€", "50€"
];

/* Variable que contiene el valor por el que se juega */
var text;

var startAngle = 0;
var arc = Math.PI / (options.length / 2);
var spinTimeout = null;

var spinArcStart = 0;
var spinTime = 0;
var spinTimeTotal = 0;

var ctx;

document.getElementById("girarRuleta").addEventListener("click", spin);

function byte2Hex(n) {
  var nybHexString = "0123456789ABCDEF";
  return (
    String(nybHexString.substr((n >> 4) & 0x0f, 1)) +
    nybHexString.substr(n & 0x0f, 1)
  );  
}

function RGB2Color(r, g, b) {
  return "#" + byte2Hex(g) + byte2Hex(b) + byte2Hex(r);
}

function getColor(item, maxitem) {
  var phase = 0;
  var center = 128;
  var width = 127;
  var frequency = Math.PI * 2 / maxitem;

  red = Math.sin(frequency * item + 2 + phase) * width + center;
  green = Math.sin(frequency * item + 0 + phase) * width + center;
  blue = Math.sin(frequency * item + 4 + phase) * width + center;

  return RGB2Color(red, green, blue);
}

function drawRouletteWheel() {
  var canvas = document.getElementById("canvas");
  if (canvas.getContext) {
    var outsideRadius = 130;
    var textRadius = 110;
    var insideRadius = 0;

    ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, 300, 300);

    ctx.strokeStyle = "black";
    ctx.lineWidth = 2;

    ctx.font = "bold 9px TimesNewRoman";

    for (var i = 0; i < options.length; i++) {
      var angle = startAngle + i * arc;
      ctx.fillStyle = getColor(i, options.length);

      ctx.beginPath();
      ctx.arc(150, 150, outsideRadius, angle, angle + arc, false);
      ctx.arc(150, 150, insideRadius, angle + arc, angle, true);
      ctx.stroke();
      ctx.fill();

      ctx.save();
      ctx.shadowOffsetX = -1;
      ctx.shadowOffsetY = -1;
      ctx.shadowBlur = 0;
      ctx.shadowColor = "rgb(220,220,220)";
      ctx.fillStyle = "black";
      ctx.translate(
        150 + Math.cos(angle + arc / 2) * textRadius,
        150 + Math.sin(angle + arc / 2) * textRadius
      );
      ctx.rotate(angle + arc / 2 + Math.PI / 2);
      var text = options[i];
      ctx.fillText(text, -ctx.measureText(text).width / 2, 0);
      ctx.restore();
    }

    //Arrow
    ctx.fillStyle = "black";
    ctx.beginPath();
    ctx.moveTo(150 - 4, 145 - (outsideRadius + 5));
    ctx.lineTo(150 + 4, 145 - (outsideRadius + 5));
    ctx.lineTo(150 + 4, 145 - (outsideRadius - 5));
    ctx.lineTo(150 + 9, 145 - (outsideRadius - 5));
    ctx.lineTo(150 + 0, 145 - (outsideRadius - 13));
    ctx.lineTo(150 - 9, 145 - (outsideRadius - 5));
    ctx.lineTo(150 - 4, 145 - (outsideRadius - 5));
    ctx.lineTo(150 - 4, 145 - (outsideRadius + 5));
    ctx.fill();
  }
}

function spin() {
  document.getElementById("girarRuleta").setAttribute("disabled","true");
  document.getElementById("consonante").setAttribute("disabled","true");
  document.getElementById("compraVocal").setAttribute("disabled","true");
  spinAngleStart = Math.random() * 10 + 10;
  spinTime = 0;
  spinTimeTotal = Math.random() * 3 + 4 * 1000;
  rotateWheel();
}

function rotateWheel() {
  spinTime += 30;
  if (spinTime >= spinTimeTotal) {
    stopRotateWheel();
    return;
  }
  var spinAngle =
    spinAngleStart - easeOut(spinTime, 0, spinAngleStart, spinTimeTotal);
  startAngle += spinAngle * Math.PI / 50;
  drawRouletteWheel();
  spinTimeout = setTimeout("rotateWheel()", 30);
}

function stopRotateWheel() {
  clearTimeout(spinTimeout);
  var degrees = startAngle * 180 / Math.PI + 90;
  var arcd = arc * 180 / Math.PI;
  var index = Math.floor((360 - degrees % 360) / arcd);
  ctx.save();
  //ctx.font = "bold 25px Helvetica, Arial";
  text = options[index];
  document.getElementById("valorRuleta").innerText = text;
  document.getElementById("consonante").removeAttribute("disabled");
  document.getElementById("compraVocal").removeAttribute("disabled");
  //ctx.fillText(text, 150 - ctx.measureText(text).width / 2, 160);
  ctx.restore();
}

function easeOut(t, b, c, d) {
  var ts = (t /= d) * t;
  var tc = ts * t;
  return b + c * (tc + -3 * ts + 3 * t);
}

drawRouletteWheel();