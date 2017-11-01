#!/usr/bin/env node
console.log('Hello, world!');
var path = require('path');
var request = require("request");
var program = require('commander');
var cheerio = require('cheerio');
var https = require('https');
var fs = require('fs');
var unzip = require('unzip');
// console.log(process.argv);

function getFileName(filepath){
    //do magic
    filename = path.parse(filepath).name;
    fileDir  = path.parse(filepath).dir;
    return [filename, fileDir];
}

function getSearchURL(filename){
    var baseURL = 'https://subscene.com/subtitles/release?q=';
    var searchURL = baseURL.concat(filename);
    return searchURL;

}

function getHTML(url){
    return new Promise(function(resolve, reject){
        request(url, function (error, response, body) {
            if (!error) {
                resolve(body);N
                return body;
            } else {
                reject(error);
            }
        }); 
    });
}

function getEnglishSubsPageUrl(searchedHtml){
     var cheer = cheerio.load(searchedHtml);
     dataList = cheer(".neutral-icon");

     dataListLen = dataList.length;

     for (i = 0; i < dataListLen; i++) {

        if((dataList[i].children[0].data).trim()=='English'){
            return (dataList[i].parent.attribs.href);
            break;
        }

    }
}

function getDownloadUrl(engUrlHtml){
      
      var cheer1 = cheerio.load(engUrlHtml);
      //console.log('hi');
      //console.log(cheer1);

      downloadButton = cheer1(".download");
      //console.log(downloadButton);
      return(downloadButton[0].children[1].attribs.href);
      
}

// function DownloadAndUnzip(URL){
//     var unzip = require('unzip');
//     var http = require('http');
//     var request = http.get(URL, function(response) {
//         response.pipe(unzip.Extract({path:'./'}))
//     });
// }



var DownloadAndUnzip = function(downloadUrl, dest, cb) {

  //console.log(downloadUrl);
 
  //var file = fs.WriteStream(dest);
  var request = https.get(downloadUrl, function(response) {
    //console.log(response.statusCode);
    //console.log("I am almost done");
    
    dast = dest.concat(response.pipe(unzip.Extract({ path: dest })));

   });
};

program
    .arguments('<file>')
    .action(function(filepath)
    {
        downloadSubs(filepath);
        for(i=0;i<10000;i++){
            a=i;
        }
        console.log(a);
    })
    .parse(process.argv);


function downloadSubs(filepath){

    // get filename 
    var fileInfo= getFileName(filepath);
    var fileName = fileInfo[0];
    var fileDir = fileInfo[1];

    console.log('dfgh'+fileDir);
    console.log(fileInfo);

    var searchURL = getSearchURL(fileName);
    // console.log(searchURL); 
    getHTML(searchURL).then(function(data){
        //this is called when resolved
        var searchedHtml = data;
        var engSubsPageUrl= ('https://subscene.com').concat(getEnglishSubsPageUrl(searchedHtml));
        console.log(engSubsPageUrl);
        getHTML(engSubsPageUrl).then(function(data){

            var engUrlHtml = data;
            var downloadUrl= ('https://subscene.com').concat(getDownloadUrl(engUrlHtml));
            console.log(downloadUrl);
            DownloadAndUnzip(downloadUrl,fileDir,function(data){
                //console.log(data);
                //console.log("wooooww");
            });


        },function(error){
        //this called when error happens;
           console.log(error);
        });




},function(error){
        //this called when error happens;
        console.log(error);
    });


// search subscene


//download sub


}
