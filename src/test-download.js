const https = require('https');
const fs = require('fs');

function download_image(url, download_path) {
	const file = fs.createWriteStream(download_path);
	const req = https.get(url, res => {
		res.pipe(file);
		// console.log(res.statusCode);
		// console.log(res.headers['content-type']);
		// res.pipe()

		file.on('finish', () => {
			file.close();
			console.log('Downloaded file');
		});
	});
}

// NOTE: be wary of https vs http. uh just use https normally

const link = 'https://pbs.twimg.com/media/GXMcJBmWsAAIgv-.jpg:large';
const path = '../images/file.jpg';

download_image(link, path);