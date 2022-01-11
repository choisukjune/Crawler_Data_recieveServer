//----------------------------------------------------------------------------------------------------;
var fileNm = "Server/index.js";
if( console ) console.log( "[ S ] - " + fileNm + "----------" );
//----------------------------------------------------------------------------------------------------;
//-------------------------------------------------------;
// REQUIRE;
//-------------------------------------------------------;

var cp = require( "child_process" );
var fs = require('fs');
var http = require('http');
var path = require('path');

//-------------------------------------------------------;
// VARIABLE;
//-------------------------------------------------------;
// 정리해야함 ---- 생각나는데로 하고있음.....;
//-------------------------;
//-------------------------;
//-------------------------;
//-------------------------;

global.server = {};
global.server.addRouter = function(a,b){ return global.ROUTER_LIST[ a ] = b; };

//-------------------------;
//-------------------------;
//-------------------------;
//-------------------------;
//-------------------------;

global.ROUTER_LIST = {};

//-------------------------;
//-------------------------;
//-------------------------;
//-------------------------;
//-------------------------;


global.CONST = {};
global.CONST.MongoDB = {};
global.CONST.MongoDB.OPTIONS = {
	"self" : { ID : "admin", PWD : "tjrwns2482", HOST : "localhost", PORT : 59320 }	
};

//-------------------------;
//-------------------------;
//-------------------------;
//-------------------------;

var CWD = global.process.cwd();
var server_port = 8889;

var ROUTER_DIRECTORY_PATH = CWD + "/js/";

//router등록을 한다.
(function(){
	var ROUTER_FILE_LIST = fs.readdirSync( ROUTER_DIRECTORY_PATH );
	var i =0,iLen = ROUTER_FILE_LIST.length,io;
	for(;i<iLen;++i){
		//라우터를 등록한다;
		eval( fs.readFileSync( ROUTER_DIRECTORY_PATH + ROUTER_FILE_LIST[ i ] ).toString() );
	}
})();
//-------------------------;
//-------------------------;
//-------------------------;
//-------------------------;

//-------------------------------------------------------;
// LOGIC;
//-------------------------------------------------------;

global.server = http.createServer(function(req, res){

    req.on('error', function( err ){
        console.error(err);
        res.statusCode = 400;
        res.end('400: Bad Request');
        return;
    });

    res.on('error', function( err ){ console.error(err); });

	var routerNm = req.url//.replace(/\//,"");

	if (req.method == 'POST') {
        var jsonString = '';

        req.on('data', function (data) {
            jsonString += data;
        });

        req.on('end', function () {
			//console.log(JSON.parse(jsonString));
			res.statusCode = 200;
			global.ROUTER_LIST[ routerNm ]( req, res, JSON.parse(jsonString) );
        });
    }
	else
	{
		//var routerNm = req.url.replace(/\//,"");
		var routerNm = req.url.split("?")[0];
		
		
		//필요시 mime-type 추가함;
		var _oContentTypes = {
			".aac": "audio/aac",
			".abw": "application/x-abiword",
			".arc": "application/octet-stream",
			".avi": "video/x-msvideo",
			".azw": "application/vnd.amazon.ebook",
			".bin": "application/octet-stream",
			".bz": "application/x-bzip",
			".bz2": "application/x-bzip2",
			".csh": "application/x-csh",
			".css": "text/css",
			".csv": "text/csv",
			".doc": "application/msword",
			".epub": "application/epub+zip",
			".gif": "image/gif",
			".html": "text/html",
			".htm": "text/html",
			".ico": "image/x-icon",
			".ics": "text/calendar",
			".jar": "application/java-archive",
			".jpeg.jpg": "image/jpeg",
			".jpg.jpg": "image/jpeg",
			".js": "application/js",
			".json": "application/json",
			".midi": "audio/midi",
			".mid": "audio/midi",
			".mpeg": "video/mpeg",
			".mpkg": "application/vnd.apple.installer+xml",
			".odp": "application/vnd.oasis.opendocument.presentation",
			".ods": "application/vnd.oasis.opendocument.spreadsheet",
			".odt": "application/vnd.oasis.opendocument.text",
			".oga": "audio/ogg",
			".ogv": "video/ogg",
			".ogx": "application/ogg",
			".pdf": "application/pdf",
			".ppt": "application/vnd.ms-powerpoint",
			".rar": "application/x-rar-compressed",
			".rtf": "application/rtf",
			".sh": "application/x-sh",
			".svg": "image/svg+xml",
			".swf": "application/x-shockwave-flash",
			".tar": "application/x-tar",
			".tiff": "image/tiff",
			".tif": "image/tiff",
			".ttf": "application/x-font-ttf",
			".vsd": "application/vnd.visio",
			".wav": "audio/x-wav",
			".weba": "audio/webm",
			".webm": "video/webm",
			".webp": "image/webp",
			".woff": "application/x-font-woff",
			".xhtml": "application/xhtml+xml",
			".xls": "application/vnd.ms-excel",
			".xml": "application/xml",
			".xul": "application/vnd.mozilla.xul+xml",
			".zip": "application/zip",
		//    ".3gp": "video/3gpp\naudio/3gpp if it doesn't contain video",
		//    ".3g2": "video/3gpp2\naudio/3gpp2 if it doesn't contain video",
			".7z": "application/x-7z-compressed"
		}

		//라우터를 활용하는부분이지만 이서버는 html서빙망 하므로 사용하지않음;
		/*
		if( global.ROUTER_LIST[ routerNm ] )
		{
			res.statusCode = 200;
			return global.ROUTER_LIST[ routerNm ]( req, res );
		}
		*/
		
		if( req.url == "/" )
		{
			var filePath = "./index.html"
		}
		else
		{
			var filePath = '.' + req.url.split("?")[0];
		}

		console.log( filePath );

		var extname = path.extname(filePath);
		var contentType = _oContentTypes[ extname ];

		res.writeHead(200, { 'Content-Type': contentType + ';charset=UTF-8' });		
		
		fs.readFile(filePath, function(error, content) {
				if(error)
				{
					if(error.code == 'ENOENT')
					{
						res.statusCode = 404;
						res.end('404: File Not Found - 테스트중입니다.');
					}
					else
					{
						res.writeHead(500);
						res.end('Sorry, check with the site admin for error: '+error.code+' ..\n');
						res.end(); 
					}
				}
				else
				{
					res.end(content, 'utf-8');
				}
		});
	}

	

	return;

}).listen( server_port );

//-------------------------;
//-------------------------;
//-------------------------;
//-------------------------;
//----------------------------------------------------------------------------------------------------;
if( console ) console.log( "[ E ] - " + fileNm + "----------" );
//----------------------------------------------------------------------------------------------------;