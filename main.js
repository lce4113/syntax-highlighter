document.getElementById("copy").addEventListener("click", () => {
  const html = document.getElementById("output").innerHTML;
  const blob = new Blob([html], { type: "text/html" });
  const item = new ClipboardItem({ "text/html": blob });
  navigator.clipboard.write([item]);
});

document.getElementById("input").addEventListener("input", function () {
  document.getElementById("output").innerHTML = convert(this.innerText);
});

function convert(code) {
  return code.split('\n').map(line => {
    if (/^;/.test(line)) {
      return `<span style="color: #be8446; font-family: "Fira Mono", monospace;">${line}</span>`;
    }
    spans = [];
    line.split('').map(l => {
      lastspan = spans.slice(-1)[0];
      test = (regex, category, color) => {
        if (regex.test(l)) {
          if (lastspan && [category, 'unended quote'].includes(lastspan[1])) {
            lastspan[0] += l;
          } else if (lastspan && lastspan[1] == 'space') {
            lastspan[0] = `<span style="color: ${color}; font-family: monospace;">${lastspan[0]}${l}`;
            lastspan[1] = category;
          } else {
            if (lastspan) lastspan[0] += "</span>";
            spans.push([`<span style="color: ${color}; font-family: monospace;">${l}`, category]);
          }
        }
      }
      if (/\s/.test(l)) {
        if (lastspan) {
          lastspan[0] += "&nbsp;";
        } else {
          spans.push(["&nbsp;", 'space']);
        }
        return;
      }
      if (/"/.test(l)) {
        if (lastspan && lastspan[1] == 'unended quote') {
          lastspan[0] += l;
          lastspan[1] = 'ended quote';
        } else {
          if (lastspan) lastspan[0] += "</span>";
          spans.push([`<span style="color: rgb(67, 126, 51); font-family: monospace;">${l}`, 'unended quote']);
        }
      }
      test(/[^\(\)\[\]\d'"\s]/, 'blue', '#34489b');
      test(/[\(\)\[\]]/, 'brown', '#9b503a');
      test(/[\d']/, 'green', 'rgb(67, 126, 51)');
    });
    if (spans.length > 0) spans.slice(-1)[0][0] += "</span>";
    var newl = "";
    for (const span of spans) {
      newl += span[0];
    }
    return newl;
  }).join(`
<br>`);
}