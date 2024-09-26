const https = require('https');
const fs = require('fs');

// TODO: change to .ts, use CTRL+SHIFT+B to run build task to
// turn anything .ts/ files in src into js files in build/

function download_image(url, download_path) {
	const file = fs.createWriteStream(download_path);
	const req = https.get(url, res => {
		console.log(res.headers);
		// res.pipe(file);
		console.log(res.statusCode);
		console.log(res.headers['content-type']);
		// // res.pipe()

		// file.on('finish', () => {
		// 	file.close();
		// 	console.log('Downloaded file');
		// });
	});
}

// NOTE: be wary of https vs http. uh just use https normally

const link = 'https://pbs.twimg.com/media/GXMcJBmWsAAIgv-.jpg:large';
const path = '../images/file.jpg';

download_image(link, path);