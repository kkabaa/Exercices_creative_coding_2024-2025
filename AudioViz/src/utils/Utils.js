export function loadSVG(url) {
  return fetch(url)
    .then((response) => response.text())
    .then((svgText) => {
      const parser = new DOMParser();
      const svgDoc = parser.parseFromString(svgText, "image/svg+xml");
      const paths = svgDoc.querySelectorAll("path");
      const points = [];

      paths.forEach((path) => {
        const length = path.getTotalLength();
        const numPoints = 100; // Adjust this number for more or fewer particles

        for (let i = 0; i < numPoints; i++) {
          const point = path.getPointAtLength((length * i) / numPoints);
          points.push({ x: point.x, y: point.y });
        }
      });

      // Get SVG viewBox
      const svg = svgDoc.querySelector("svg");
      const viewBox = svg.viewBox.baseVal || {
        x: 0,
        y: 0,
        width: parseInt(svg.getAttribute("width")) || 300,
        height: parseInt(svg.getAttribute("height")) || 300,
      };

      return { points, viewBox };
    });
}
