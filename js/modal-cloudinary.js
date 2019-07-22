/**
 * @description a javascript functionality which helps you to accelerate the integration of Cloudinary in your VanillaJS project.
 * Functionality ready to use, just remember to setup your constant of cloudName and unsignedUploadPreset in the index.html
 * @author Ali Adame
 * @version 0.3
 * @date 22-07-2019
 * **/
const javascriptDebugging = false;
	
// Handle selected files
var handleFiles = function(files) {
	for (var i = 0; i < files.length; i++) {
		uploadFile(files[i]); // call the function to upload the file
	}
};
	
function uploadFile(file) {
	var url = `https://api.cloudinary.com/v1_1/${cloudName}/auto/upload`;
	var xhr = new XMLHttpRequest();
	var fd = new FormData();
	xhr.open('POST', url, true);
	xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest');

	// Reset the upload progress bar
	document.getElementById('progress').style.width = 0;

	// Update progress (can be used to show progress indicator)
	xhr.upload.addEventListener("progress", function(e) {
		var progress = Math.round((e.loaded * 100.0) / e.total);
		document.getElementById('progress').style.width = progress + "%";

		if(javascriptDebugging) {
			console.log(`fileuploadprogress data.loaded: ${e.loaded}, data.total: ${e.total}`);
		}
	});

	xhr.onreadystatechange = function(e) {
		if (xhr.readyState == 4 && xhr.status == 200) {
			// File uploaded successfully
			var response = JSON.parse(xhr.responseText);
			var url = response.secure_url;
			if(javascriptDebugging) {
				console.log("Loaded url: " + url);
			}
			if(typeof url != 'undefined') {
				document.getElementById("cloudinaryLoadedImg").value = url;
			}

			var ext = url.split('.');
			debugger;
			var imageReg = /[\/.](gif|jpg|jpeg|tiff|png)$/i;
			if(javascriptDebugging) {
				console.log("Upload was image file: " + imageReg.test(url));
			}
			if(imageReg.test(url)) {
				ext = ext[(ext.length-1)];
				// Create a thumbnail of the uploaded image, with 150px width
				var tokens = url.split('/');
				tokens.splice(-2, 0, 'w_150,c_scale');
				var img = new Image(); // HTML5 Constructor
				img.src = tokens.join('/');
				img.alt = response.public_id;
				document.getElementById('galleryFileUpload').appendChild(img);
			} else {
				// Create a link of the uploaded file
				var a = document.createElement('a');
				var linkText = document.createTextNode(url.substring(0, 40).concat("..."));
				a.appendChild(linkText);
				a.title = url;
				a.href = url;
				a.target = "_blank";
				document.getElementById('galleryFileUpload').appendChild(a);
			}
		}
	};

	fd.append('upload_preset', unsignedUploadPreset);
	fd.append('tags', 'browser_upload'); // Optional - add tag for image admin in Cloudinary
	fd.append('file', file);
	xhr.send(fd);
}
	
function doDrop(event) {
	var dt = event.dataTransfer;
	var files = dt.files;
	handleFiles(files);
}