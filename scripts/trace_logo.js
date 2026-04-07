const potrace = require('potrace');
const fs = require('fs');
const path = require('path');

const inputPath = path.join(__dirname, '..', 'public', 'Assets', 'Images', 'Logo.png');
const outputPath = path.join(__dirname, '..', 'public', 'Assets', 'Images', 'Logo.svg');

if (!fs.existsSync(inputPath)) {
    console.error("Input file not found:", inputPath);
    process.exit(1);
}

// We want a solid white output on transparent to map perfectly to SVG paths
const params = {
    color: '#ffffff',
    background: 'transparent',
    threshold: potrace.Potrace.OPT_THRESHOLD_AUTO,
};

potrace.trace(inputPath, params, function(err, svg) {
    if (err) throw err;
    fs.writeFileSync(outputPath, svg);
    console.log("Successfully traced Logo.png to Logo.svg!");
});
