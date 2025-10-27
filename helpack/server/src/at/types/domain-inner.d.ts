/** SrcMap形如：
{
	"iconSr": "/web-app/sub-apps/x1/favicon.ico",
	"manifestJsonSrc": "/web-app/sub-apps/x1/manifest.json",
	"mainCssSrc": "",
	"chunkCssSrcList": [],
	"runtimeMainJsSrc": "/cra_runtime_1572523258959.js",
	"chunkJsSrcList": [],
	"mainJsSrc": "/web-app/sub-apps/x1/static/js/main.d3b1d7b0.js"
}
*/
export interface SrcMap {
  iconSr: string,
  manifestJsonSrc: string,
  mainCssSrc: string,
  chunkCssSrcList: string[],
  runtimeMainJsSrc: string,
  chunkJsSrcList: string[],
  mainJsSrc: string,
}