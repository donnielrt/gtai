/******/ (function(modules) { // webpackBootstrap
/******/ 	function hotDisposeChunk(chunkId) {
/******/ 		delete installedChunks[chunkId];
/******/ 	}
/******/ 	var parentHotUpdateCallback = this["webpackHotUpdate"];
/******/ 	this["webpackHotUpdate"] = 
/******/ 	function webpackHotUpdateCallback(chunkId, moreModules) { // eslint-disable-line no-unused-vars
/******/ 		hotAddUpdateChunk(chunkId, moreModules);
/******/ 		if(parentHotUpdateCallback) parentHotUpdateCallback(chunkId, moreModules);
/******/ 	} ;
/******/ 	
/******/ 	function hotDownloadUpdateChunk(chunkId) { // eslint-disable-line no-unused-vars
/******/ 		var head = document.getElementsByTagName("head")[0];
/******/ 		var script = document.createElement("script");
/******/ 		script.type = "text/javascript";
/******/ 		script.charset = "utf-8";
/******/ 		script.src = __webpack_require__.p + "" + chunkId + "." + hotCurrentHash + ".hot-update.js";
/******/ 		head.appendChild(script);
/******/ 	}
/******/ 	
/******/ 	function hotDownloadManifest() { // eslint-disable-line no-unused-vars
/******/ 		return new Promise(function(resolve, reject) {
/******/ 			if(typeof XMLHttpRequest === "undefined")
/******/ 				return reject(new Error("No browser support"));
/******/ 			try {
/******/ 				var request = new XMLHttpRequest();
/******/ 				var requestPath = __webpack_require__.p + "" + hotCurrentHash + ".hot-update.json";
/******/ 				request.open("GET", requestPath, true);
/******/ 				request.timeout = 10000;
/******/ 				request.send(null);
/******/ 			} catch(err) {
/******/ 				return reject(err);
/******/ 			}
/******/ 			request.onreadystatechange = function() {
/******/ 				if(request.readyState !== 4) return;
/******/ 				if(request.status === 0) {
/******/ 					// timeout
/******/ 					reject(new Error("Manifest request to " + requestPath + " timed out."));
/******/ 				} else if(request.status === 404) {
/******/ 					// no update available
/******/ 					resolve();
/******/ 				} else if(request.status !== 200 && request.status !== 304) {
/******/ 					// other failure
/******/ 					reject(new Error("Manifest request to " + requestPath + " failed."));
/******/ 				} else {
/******/ 					// success
/******/ 					try {
/******/ 						var update = JSON.parse(request.responseText);
/******/ 					} catch(e) {
/******/ 						reject(e);
/******/ 						return;
/******/ 					}
/******/ 					resolve(update);
/******/ 				}
/******/ 			};
/******/ 		});
/******/ 	}

/******/ 	
/******/ 	
/******/ 	var hotApplyOnUpdate = true;
/******/ 	var hotCurrentHash = "e035fe537e8df0afbab7"; // eslint-disable-line no-unused-vars
/******/ 	var hotCurrentModuleData = {};
/******/ 	var hotMainModule = true; // eslint-disable-line no-unused-vars
/******/ 	var hotCurrentParents = []; // eslint-disable-line no-unused-vars
/******/ 	var hotCurrentParentsTemp = []; // eslint-disable-line no-unused-vars
/******/ 	
/******/ 	function hotCreateRequire(moduleId) { // eslint-disable-line no-unused-vars
/******/ 		var me = installedModules[moduleId];
/******/ 		if(!me) return __webpack_require__;
/******/ 		var fn = function(request) {
/******/ 			if(me.hot.active) {
/******/ 				if(installedModules[request]) {
/******/ 					if(installedModules[request].parents.indexOf(moduleId) < 0)
/******/ 						installedModules[request].parents.push(moduleId);
/******/ 				} else hotCurrentParents = [moduleId];
/******/ 				if(me.children.indexOf(request) < 0)
/******/ 					me.children.push(request);
/******/ 			} else {
/******/ 				console.warn("[HMR] unexpected require(" + request + ") from disposed module " + moduleId);
/******/ 				hotCurrentParents = [];
/******/ 			}
/******/ 			hotMainModule = false;
/******/ 			return __webpack_require__(request);
/******/ 		};
/******/ 		var ObjectFactory = function ObjectFactory(name) {
/******/ 			return {
/******/ 				configurable: true,
/******/ 				enumerable: true,
/******/ 				get: function() {
/******/ 					return __webpack_require__[name];
/******/ 				},
/******/ 				set: function(value) {
/******/ 					__webpack_require__[name] = value;
/******/ 				}
/******/ 			};
/******/ 		};
/******/ 		for(var name in __webpack_require__) {
/******/ 			if(Object.prototype.hasOwnProperty.call(__webpack_require__, name)) {
/******/ 				Object.defineProperty(fn, name, ObjectFactory(name));
/******/ 			}
/******/ 		}
/******/ 		Object.defineProperty(fn, "e", {
/******/ 			enumerable: true,
/******/ 			value: function(chunkId) {
/******/ 				if(hotStatus === "ready")
/******/ 					hotSetStatus("prepare");
/******/ 				hotChunksLoading++;
/******/ 				return __webpack_require__.e(chunkId).then(finishChunkLoading, function(err) {
/******/ 					finishChunkLoading();
/******/ 					throw err;
/******/ 				});
/******/ 	
/******/ 				function finishChunkLoading() {
/******/ 					hotChunksLoading--;
/******/ 					if(hotStatus === "prepare") {
/******/ 						if(!hotWaitingFilesMap[chunkId]) {
/******/ 							hotEnsureUpdateChunk(chunkId);
/******/ 						}
/******/ 						if(hotChunksLoading === 0 && hotWaitingFiles === 0) {
/******/ 							hotUpdateDownloaded();
/******/ 						}
/******/ 					}
/******/ 				}
/******/ 			}
/******/ 		});
/******/ 		return fn;
/******/ 	}
/******/ 	
/******/ 	function hotCreateModule(moduleId) { // eslint-disable-line no-unused-vars
/******/ 		var hot = {
/******/ 			// private stuff
/******/ 			_acceptedDependencies: {},
/******/ 			_declinedDependencies: {},
/******/ 			_selfAccepted: false,
/******/ 			_selfDeclined: false,
/******/ 			_disposeHandlers: [],
/******/ 			_main: hotMainModule,
/******/ 	
/******/ 			// Module API
/******/ 			active: true,
/******/ 			accept: function(dep, callback) {
/******/ 				if(typeof dep === "undefined")
/******/ 					hot._selfAccepted = true;
/******/ 				else if(typeof dep === "function")
/******/ 					hot._selfAccepted = dep;
/******/ 				else if(typeof dep === "object")
/******/ 					for(var i = 0; i < dep.length; i++)
/******/ 						hot._acceptedDependencies[dep[i]] = callback || function() {};
/******/ 				else
/******/ 					hot._acceptedDependencies[dep] = callback || function() {};
/******/ 			},
/******/ 			decline: function(dep) {
/******/ 				if(typeof dep === "undefined")
/******/ 					hot._selfDeclined = true;
/******/ 				else if(typeof dep === "object")
/******/ 					for(var i = 0; i < dep.length; i++)
/******/ 						hot._declinedDependencies[dep[i]] = true;
/******/ 				else
/******/ 					hot._declinedDependencies[dep] = true;
/******/ 			},
/******/ 			dispose: function(callback) {
/******/ 				hot._disposeHandlers.push(callback);
/******/ 			},
/******/ 			addDisposeHandler: function(callback) {
/******/ 				hot._disposeHandlers.push(callback);
/******/ 			},
/******/ 			removeDisposeHandler: function(callback) {
/******/ 				var idx = hot._disposeHandlers.indexOf(callback);
/******/ 				if(idx >= 0) hot._disposeHandlers.splice(idx, 1);
/******/ 			},
/******/ 	
/******/ 			// Management API
/******/ 			check: hotCheck,
/******/ 			apply: hotApply,
/******/ 			status: function(l) {
/******/ 				if(!l) return hotStatus;
/******/ 				hotStatusHandlers.push(l);
/******/ 			},
/******/ 			addStatusHandler: function(l) {
/******/ 				hotStatusHandlers.push(l);
/******/ 			},
/******/ 			removeStatusHandler: function(l) {
/******/ 				var idx = hotStatusHandlers.indexOf(l);
/******/ 				if(idx >= 0) hotStatusHandlers.splice(idx, 1);
/******/ 			},
/******/ 	
/******/ 			//inherit from previous dispose call
/******/ 			data: hotCurrentModuleData[moduleId]
/******/ 		};
/******/ 		hotMainModule = true;
/******/ 		return hot;
/******/ 	}
/******/ 	
/******/ 	var hotStatusHandlers = [];
/******/ 	var hotStatus = "idle";
/******/ 	
/******/ 	function hotSetStatus(newStatus) {
/******/ 		hotStatus = newStatus;
/******/ 		for(var i = 0; i < hotStatusHandlers.length; i++)
/******/ 			hotStatusHandlers[i].call(null, newStatus);
/******/ 	}
/******/ 	
/******/ 	// while downloading
/******/ 	var hotWaitingFiles = 0;
/******/ 	var hotChunksLoading = 0;
/******/ 	var hotWaitingFilesMap = {};
/******/ 	var hotRequestedFilesMap = {};
/******/ 	var hotAvailableFilesMap = {};
/******/ 	var hotDeferred;
/******/ 	
/******/ 	// The update info
/******/ 	var hotUpdate, hotUpdateNewHash;
/******/ 	
/******/ 	function toModuleId(id) {
/******/ 		var isNumber = (+id) + "" === id;
/******/ 		return isNumber ? +id : id;
/******/ 	}
/******/ 	
/******/ 	function hotCheck(apply) {
/******/ 		if(hotStatus !== "idle") throw new Error("check() is only allowed in idle status");
/******/ 		hotApplyOnUpdate = apply;
/******/ 		hotSetStatus("check");
/******/ 		return hotDownloadManifest().then(function(update) {
/******/ 			if(!update) {
/******/ 				hotSetStatus("idle");
/******/ 				return null;
/******/ 			}
/******/ 	
/******/ 			hotRequestedFilesMap = {};
/******/ 			hotWaitingFilesMap = {};
/******/ 			hotAvailableFilesMap = update.c;
/******/ 			hotUpdateNewHash = update.h;
/******/ 	
/******/ 			hotSetStatus("prepare");
/******/ 			var promise = new Promise(function(resolve, reject) {
/******/ 				hotDeferred = {
/******/ 					resolve: resolve,
/******/ 					reject: reject
/******/ 				};
/******/ 			});
/******/ 			hotUpdate = {};
/******/ 			var chunkId = 0;
/******/ 			{ // eslint-disable-line no-lone-blocks
/******/ 				/*globals chunkId */
/******/ 				hotEnsureUpdateChunk(chunkId);
/******/ 			}
/******/ 			if(hotStatus === "prepare" && hotChunksLoading === 0 && hotWaitingFiles === 0) {
/******/ 				hotUpdateDownloaded();
/******/ 			}
/******/ 			return promise;
/******/ 		});
/******/ 	}
/******/ 	
/******/ 	function hotAddUpdateChunk(chunkId, moreModules) { // eslint-disable-line no-unused-vars
/******/ 		if(!hotAvailableFilesMap[chunkId] || !hotRequestedFilesMap[chunkId])
/******/ 			return;
/******/ 		hotRequestedFilesMap[chunkId] = false;
/******/ 		for(var moduleId in moreModules) {
/******/ 			if(Object.prototype.hasOwnProperty.call(moreModules, moduleId)) {
/******/ 				hotUpdate[moduleId] = moreModules[moduleId];
/******/ 			}
/******/ 		}
/******/ 		if(--hotWaitingFiles === 0 && hotChunksLoading === 0) {
/******/ 			hotUpdateDownloaded();
/******/ 		}
/******/ 	}
/******/ 	
/******/ 	function hotEnsureUpdateChunk(chunkId) {
/******/ 		if(!hotAvailableFilesMap[chunkId]) {
/******/ 			hotWaitingFilesMap[chunkId] = true;
/******/ 		} else {
/******/ 			hotRequestedFilesMap[chunkId] = true;
/******/ 			hotWaitingFiles++;
/******/ 			hotDownloadUpdateChunk(chunkId);
/******/ 		}
/******/ 	}
/******/ 	
/******/ 	function hotUpdateDownloaded() {
/******/ 		hotSetStatus("ready");
/******/ 		var deferred = hotDeferred;
/******/ 		hotDeferred = null;
/******/ 		if(!deferred) return;
/******/ 		if(hotApplyOnUpdate) {
/******/ 			hotApply(hotApplyOnUpdate).then(function(result) {
/******/ 				deferred.resolve(result);
/******/ 			}, function(err) {
/******/ 				deferred.reject(err);
/******/ 			});
/******/ 		} else {
/******/ 			var outdatedModules = [];
/******/ 			for(var id in hotUpdate) {
/******/ 				if(Object.prototype.hasOwnProperty.call(hotUpdate, id)) {
/******/ 					outdatedModules.push(toModuleId(id));
/******/ 				}
/******/ 			}
/******/ 			deferred.resolve(outdatedModules);
/******/ 		}
/******/ 	}
/******/ 	
/******/ 	function hotApply(options) {
/******/ 		if(hotStatus !== "ready") throw new Error("apply() is only allowed in ready status");
/******/ 		options = options || {};
/******/ 	
/******/ 		var cb;
/******/ 		var i;
/******/ 		var j;
/******/ 		var module;
/******/ 		var moduleId;
/******/ 	
/******/ 		function getAffectedStuff(updateModuleId) {
/******/ 			var outdatedModules = [updateModuleId];
/******/ 			var outdatedDependencies = {};
/******/ 	
/******/ 			var queue = outdatedModules.slice().map(function(id) {
/******/ 				return {
/******/ 					chain: [id],
/******/ 					id: id
/******/ 				};
/******/ 			});
/******/ 			while(queue.length > 0) {
/******/ 				var queueItem = queue.pop();
/******/ 				var moduleId = queueItem.id;
/******/ 				var chain = queueItem.chain;
/******/ 				module = installedModules[moduleId];
/******/ 				if(!module || module.hot._selfAccepted)
/******/ 					continue;
/******/ 				if(module.hot._selfDeclined) {
/******/ 					return {
/******/ 						type: "self-declined",
/******/ 						chain: chain,
/******/ 						moduleId: moduleId
/******/ 					};
/******/ 				}
/******/ 				if(module.hot._main) {
/******/ 					return {
/******/ 						type: "unaccepted",
/******/ 						chain: chain,
/******/ 						moduleId: moduleId
/******/ 					};
/******/ 				}
/******/ 				for(var i = 0; i < module.parents.length; i++) {
/******/ 					var parentId = module.parents[i];
/******/ 					var parent = installedModules[parentId];
/******/ 					if(!parent) continue;
/******/ 					if(parent.hot._declinedDependencies[moduleId]) {
/******/ 						return {
/******/ 							type: "declined",
/******/ 							chain: chain.concat([parentId]),
/******/ 							moduleId: moduleId,
/******/ 							parentId: parentId
/******/ 						};
/******/ 					}
/******/ 					if(outdatedModules.indexOf(parentId) >= 0) continue;
/******/ 					if(parent.hot._acceptedDependencies[moduleId]) {
/******/ 						if(!outdatedDependencies[parentId])
/******/ 							outdatedDependencies[parentId] = [];
/******/ 						addAllToSet(outdatedDependencies[parentId], [moduleId]);
/******/ 						continue;
/******/ 					}
/******/ 					delete outdatedDependencies[parentId];
/******/ 					outdatedModules.push(parentId);
/******/ 					queue.push({
/******/ 						chain: chain.concat([parentId]),
/******/ 						id: parentId
/******/ 					});
/******/ 				}
/******/ 			}
/******/ 	
/******/ 			return {
/******/ 				type: "accepted",
/******/ 				moduleId: updateModuleId,
/******/ 				outdatedModules: outdatedModules,
/******/ 				outdatedDependencies: outdatedDependencies
/******/ 			};
/******/ 		}
/******/ 	
/******/ 		function addAllToSet(a, b) {
/******/ 			for(var i = 0; i < b.length; i++) {
/******/ 				var item = b[i];
/******/ 				if(a.indexOf(item) < 0)
/******/ 					a.push(item);
/******/ 			}
/******/ 		}
/******/ 	
/******/ 		// at begin all updates modules are outdated
/******/ 		// the "outdated" status can propagate to parents if they don't accept the children
/******/ 		var outdatedDependencies = {};
/******/ 		var outdatedModules = [];
/******/ 		var appliedUpdate = {};
/******/ 	
/******/ 		var warnUnexpectedRequire = function warnUnexpectedRequire() {
/******/ 			console.warn("[HMR] unexpected require(" + result.moduleId + ") to disposed module");
/******/ 		};
/******/ 	
/******/ 		for(var id in hotUpdate) {
/******/ 			if(Object.prototype.hasOwnProperty.call(hotUpdate, id)) {
/******/ 				moduleId = toModuleId(id);
/******/ 				var result;
/******/ 				if(hotUpdate[id]) {
/******/ 					result = getAffectedStuff(moduleId);
/******/ 				} else {
/******/ 					result = {
/******/ 						type: "disposed",
/******/ 						moduleId: id
/******/ 					};
/******/ 				}
/******/ 				var abortError = false;
/******/ 				var doApply = false;
/******/ 				var doDispose = false;
/******/ 				var chainInfo = "";
/******/ 				if(result.chain) {
/******/ 					chainInfo = "\nUpdate propagation: " + result.chain.join(" -> ");
/******/ 				}
/******/ 				switch(result.type) {
/******/ 					case "self-declined":
/******/ 						if(options.onDeclined)
/******/ 							options.onDeclined(result);
/******/ 						if(!options.ignoreDeclined)
/******/ 							abortError = new Error("Aborted because of self decline: " + result.moduleId + chainInfo);
/******/ 						break;
/******/ 					case "declined":
/******/ 						if(options.onDeclined)
/******/ 							options.onDeclined(result);
/******/ 						if(!options.ignoreDeclined)
/******/ 							abortError = new Error("Aborted because of declined dependency: " + result.moduleId + " in " + result.parentId + chainInfo);
/******/ 						break;
/******/ 					case "unaccepted":
/******/ 						if(options.onUnaccepted)
/******/ 							options.onUnaccepted(result);
/******/ 						if(!options.ignoreUnaccepted)
/******/ 							abortError = new Error("Aborted because " + moduleId + " is not accepted" + chainInfo);
/******/ 						break;
/******/ 					case "accepted":
/******/ 						if(options.onAccepted)
/******/ 							options.onAccepted(result);
/******/ 						doApply = true;
/******/ 						break;
/******/ 					case "disposed":
/******/ 						if(options.onDisposed)
/******/ 							options.onDisposed(result);
/******/ 						doDispose = true;
/******/ 						break;
/******/ 					default:
/******/ 						throw new Error("Unexception type " + result.type);
/******/ 				}
/******/ 				if(abortError) {
/******/ 					hotSetStatus("abort");
/******/ 					return Promise.reject(abortError);
/******/ 				}
/******/ 				if(doApply) {
/******/ 					appliedUpdate[moduleId] = hotUpdate[moduleId];
/******/ 					addAllToSet(outdatedModules, result.outdatedModules);
/******/ 					for(moduleId in result.outdatedDependencies) {
/******/ 						if(Object.prototype.hasOwnProperty.call(result.outdatedDependencies, moduleId)) {
/******/ 							if(!outdatedDependencies[moduleId])
/******/ 								outdatedDependencies[moduleId] = [];
/******/ 							addAllToSet(outdatedDependencies[moduleId], result.outdatedDependencies[moduleId]);
/******/ 						}
/******/ 					}
/******/ 				}
/******/ 				if(doDispose) {
/******/ 					addAllToSet(outdatedModules, [result.moduleId]);
/******/ 					appliedUpdate[moduleId] = warnUnexpectedRequire;
/******/ 				}
/******/ 			}
/******/ 		}
/******/ 	
/******/ 		// Store self accepted outdated modules to require them later by the module system
/******/ 		var outdatedSelfAcceptedModules = [];
/******/ 		for(i = 0; i < outdatedModules.length; i++) {
/******/ 			moduleId = outdatedModules[i];
/******/ 			if(installedModules[moduleId] && installedModules[moduleId].hot._selfAccepted)
/******/ 				outdatedSelfAcceptedModules.push({
/******/ 					module: moduleId,
/******/ 					errorHandler: installedModules[moduleId].hot._selfAccepted
/******/ 				});
/******/ 		}
/******/ 	
/******/ 		// Now in "dispose" phase
/******/ 		hotSetStatus("dispose");
/******/ 		Object.keys(hotAvailableFilesMap).forEach(function(chunkId) {
/******/ 			if(hotAvailableFilesMap[chunkId] === false) {
/******/ 				hotDisposeChunk(chunkId);
/******/ 			}
/******/ 		});
/******/ 	
/******/ 		var idx;
/******/ 		var queue = outdatedModules.slice();
/******/ 		while(queue.length > 0) {
/******/ 			moduleId = queue.pop();
/******/ 			module = installedModules[moduleId];
/******/ 			if(!module) continue;
/******/ 	
/******/ 			var data = {};
/******/ 	
/******/ 			// Call dispose handlers
/******/ 			var disposeHandlers = module.hot._disposeHandlers;
/******/ 			for(j = 0; j < disposeHandlers.length; j++) {
/******/ 				cb = disposeHandlers[j];
/******/ 				cb(data);
/******/ 			}
/******/ 			hotCurrentModuleData[moduleId] = data;
/******/ 	
/******/ 			// disable module (this disables requires from this module)
/******/ 			module.hot.active = false;
/******/ 	
/******/ 			// remove module from cache
/******/ 			delete installedModules[moduleId];
/******/ 	
/******/ 			// remove "parents" references from all children
/******/ 			for(j = 0; j < module.children.length; j++) {
/******/ 				var child = installedModules[module.children[j]];
/******/ 				if(!child) continue;
/******/ 				idx = child.parents.indexOf(moduleId);
/******/ 				if(idx >= 0) {
/******/ 					child.parents.splice(idx, 1);
/******/ 				}
/******/ 			}
/******/ 		}
/******/ 	
/******/ 		// remove outdated dependency from module children
/******/ 		var dependency;
/******/ 		var moduleOutdatedDependencies;
/******/ 		for(moduleId in outdatedDependencies) {
/******/ 			if(Object.prototype.hasOwnProperty.call(outdatedDependencies, moduleId)) {
/******/ 				module = installedModules[moduleId];
/******/ 				if(module) {
/******/ 					moduleOutdatedDependencies = outdatedDependencies[moduleId];
/******/ 					for(j = 0; j < moduleOutdatedDependencies.length; j++) {
/******/ 						dependency = moduleOutdatedDependencies[j];
/******/ 						idx = module.children.indexOf(dependency);
/******/ 						if(idx >= 0) module.children.splice(idx, 1);
/******/ 					}
/******/ 				}
/******/ 			}
/******/ 		}
/******/ 	
/******/ 		// Not in "apply" phase
/******/ 		hotSetStatus("apply");
/******/ 	
/******/ 		hotCurrentHash = hotUpdateNewHash;
/******/ 	
/******/ 		// insert new code
/******/ 		for(moduleId in appliedUpdate) {
/******/ 			if(Object.prototype.hasOwnProperty.call(appliedUpdate, moduleId)) {
/******/ 				modules[moduleId] = appliedUpdate[moduleId];
/******/ 			}
/******/ 		}
/******/ 	
/******/ 		// call accept handlers
/******/ 		var error = null;
/******/ 		for(moduleId in outdatedDependencies) {
/******/ 			if(Object.prototype.hasOwnProperty.call(outdatedDependencies, moduleId)) {
/******/ 				module = installedModules[moduleId];
/******/ 				moduleOutdatedDependencies = outdatedDependencies[moduleId];
/******/ 				var callbacks = [];
/******/ 				for(i = 0; i < moduleOutdatedDependencies.length; i++) {
/******/ 					dependency = moduleOutdatedDependencies[i];
/******/ 					cb = module.hot._acceptedDependencies[dependency];
/******/ 					if(callbacks.indexOf(cb) >= 0) continue;
/******/ 					callbacks.push(cb);
/******/ 				}
/******/ 				for(i = 0; i < callbacks.length; i++) {
/******/ 					cb = callbacks[i];
/******/ 					try {
/******/ 						cb(moduleOutdatedDependencies);
/******/ 					} catch(err) {
/******/ 						if(options.onErrored) {
/******/ 							options.onErrored({
/******/ 								type: "accept-errored",
/******/ 								moduleId: moduleId,
/******/ 								dependencyId: moduleOutdatedDependencies[i],
/******/ 								error: err
/******/ 							});
/******/ 						}
/******/ 						if(!options.ignoreErrored) {
/******/ 							if(!error)
/******/ 								error = err;
/******/ 						}
/******/ 					}
/******/ 				}
/******/ 			}
/******/ 		}
/******/ 	
/******/ 		// Load self accepted modules
/******/ 		for(i = 0; i < outdatedSelfAcceptedModules.length; i++) {
/******/ 			var item = outdatedSelfAcceptedModules[i];
/******/ 			moduleId = item.module;
/******/ 			hotCurrentParents = [moduleId];
/******/ 			try {
/******/ 				__webpack_require__(moduleId);
/******/ 			} catch(err) {
/******/ 				if(typeof item.errorHandler === "function") {
/******/ 					try {
/******/ 						item.errorHandler(err);
/******/ 					} catch(err2) {
/******/ 						if(options.onErrored) {
/******/ 							options.onErrored({
/******/ 								type: "self-accept-error-handler-errored",
/******/ 								moduleId: moduleId,
/******/ 								error: err2,
/******/ 								orginalError: err
/******/ 							});
/******/ 						}
/******/ 						if(!options.ignoreErrored) {
/******/ 							if(!error)
/******/ 								error = err2;
/******/ 						}
/******/ 						if(!error)
/******/ 							error = err;
/******/ 					}
/******/ 				} else {
/******/ 					if(options.onErrored) {
/******/ 						options.onErrored({
/******/ 							type: "self-accept-errored",
/******/ 							moduleId: moduleId,
/******/ 							error: err
/******/ 						});
/******/ 					}
/******/ 					if(!options.ignoreErrored) {
/******/ 						if(!error)
/******/ 							error = err;
/******/ 					}
/******/ 				}
/******/ 			}
/******/ 		}
/******/ 	
/******/ 		// handle errors in accept handlers and self accepted module load
/******/ 		if(error) {
/******/ 			hotSetStatus("fail");
/******/ 			return Promise.reject(error);
/******/ 		}
/******/ 	
/******/ 		hotSetStatus("idle");
/******/ 		return Promise.resolve(outdatedModules);
/******/ 	}

/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {},
/******/ 			hot: hotCreateModule(moduleId),
/******/ 			parents: (hotCurrentParentsTemp = hotCurrentParents, hotCurrentParents = [], hotCurrentParentsTemp),
/******/ 			children: []
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, hotCreateRequire(moduleId));

/******/ 		// Flag the module as loaded
/******/ 		module.l = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// identity function for calling harmony imports with the correct context
/******/ 	__webpack_require__.i = function(value) { return value; };

/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};

/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};

/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// __webpack_hash__
/******/ 	__webpack_require__.h = function() { return hotCurrentHash; };

/******/ 	// Load entry module and return exports
/******/ 	return hotCreateRequire(51)(__webpack_require__.s = 51);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

/*

The MIT License (MIT)

Original Library 
  - Copyright (c) Marak Squires

Additional functionality
 - Copyright (c) Sindre Sorhus <sindresorhus@gmail.com> (sindresorhus.com)

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.

*/

var colors = {};
module['exports'] = colors;

colors.themes = {};

var ansiStyles = colors.styles = __webpack_require__(48);
var defineProps = Object.defineProperties;

colors.supportsColor = __webpack_require__(49);

if (typeof colors.enabled === "undefined") {
  colors.enabled = colors.supportsColor;
}

colors.stripColors = colors.strip = function(str){
  return ("" + str).replace(/\x1B\[\d+m/g, '');
};


var stylize = colors.stylize = function stylize (str, style) {
  if (!colors.enabled) {
    return str+'';
  }

  return ansiStyles[style].open + str + ansiStyles[style].close;
}

var matchOperatorsRe = /[|\\{}()[\]^$+*?.]/g;
var escapeStringRegexp = function (str) {
  if (typeof str !== 'string') {
    throw new TypeError('Expected a string');
  }
  return str.replace(matchOperatorsRe,  '\\$&');
}

function build(_styles) {
  var builder = function builder() {
    return applyStyle.apply(builder, arguments);
  };
  builder._styles = _styles;
  // __proto__ is used because we must return a function, but there is
  // no way to create a function with a different prototype.
  builder.__proto__ = proto;
  return builder;
}

var styles = (function () {
  var ret = {};
  ansiStyles.grey = ansiStyles.gray;
  Object.keys(ansiStyles).forEach(function (key) {
    ansiStyles[key].closeRe = new RegExp(escapeStringRegexp(ansiStyles[key].close), 'g');
    ret[key] = {
      get: function () {
        return build(this._styles.concat(key));
      }
    };
  });
  return ret;
})();

var proto = defineProps(function colors() {}, styles);

function applyStyle() {
  var args = arguments;
  var argsLen = args.length;
  var str = argsLen !== 0 && String(arguments[0]);
  if (argsLen > 1) {
    for (var a = 1; a < argsLen; a++) {
      str += ' ' + args[a];
    }
  }

  if (!colors.enabled || !str) {
    return str;
  }

  var nestedStyles = this._styles;

  var i = nestedStyles.length;
  while (i--) {
    var code = ansiStyles[nestedStyles[i]];
    str = code.open + str.replace(code.closeRe, code.open) + code.close;
  }

  return str;
}

function applyTheme (theme) {
  for (var style in theme) {
    (function(style){
      colors[style] = function(str){
        if (typeof theme[style] === 'object'){
          var out = str;
          for (var i in theme[style]){
            out = colors[theme[style][i]](out);
          }
          return out;
        }
        return colors[theme[style]](str);
      };
    })(style)
  }
}

colors.setTheme = function (theme) {
  if (typeof theme === 'string') {
    try {
      colors.themes[theme] = !(function webpackMissingModule() { var e = new Error("Cannot find module \".\""); e.code = 'MODULE_NOT_FOUND';; throw e; }());
      applyTheme(colors.themes[theme]);
      return colors.themes[theme];
    } catch (err) {
      console.log(err);
      return err;
    }
  } else {
    applyTheme(theme);
  }
};

function init() {
  var ret = {};
  Object.keys(styles).forEach(function (name) {
    ret[name] = {
      get: function () {
        return build([name]);
      }
    };
  });
  return ret;
}

var sequencer = function sequencer (map, str) {
  var exploded = str.split(""), i = 0;
  exploded = exploded.map(map);
  return exploded.join("");
};

// custom formatter methods
colors.trap = __webpack_require__(40);
colors.zalgo = __webpack_require__(41);

// maps
colors.maps = {};
colors.maps.america = __webpack_require__(44);
colors.maps.zebra = __webpack_require__(47);
colors.maps.rainbow = __webpack_require__(45);
colors.maps.random = __webpack_require__(46)

for (var map in colors.maps) {
  (function(map){
    colors[map] = function (str) {
      return sequencer(colors.maps[map], str);
    }
  })(map)
}

defineProps(colors, init());

/***/ }),
/* 1 */
/***/ (function(module, exports) {

module.exports = class Size {

	static derive(val) {
		if (val instanceof Size) {
			return val;
		}

		if (Number.isInteger(val)) {
			return new Size(1, 1, val);
		}

		if (val instanceof Object) {
			return new Size(val.x, val.y, val.z);
		}

		throw "Could not create size object";
	}

	constructor(x, y, z) {
		this.x = x;
		this.y = y;
		this.z = z;
	}

	get length() {
		return this.x * this.y * this.z;
	}

	get dimensions() {
		if (this.x * this.y * this.z === 0) return 0;

		if (this.x * this.y === 1) return 1;

		if (this.x === 1) return 2;

		return 3;
	}

};

/***/ }),
/* 2 */
/***/ (function(module, exports) {

//http://stackoverflow.com/questions/5623838/rgb-to-hex-and-hex-to-rgb
function componentToHex(c) {
    var hex = c.toString(16);
    return hex.length === 1 ? "0" + hex : hex;
}
function rgbToHex(r, g, b) {
    return parseInt(componentToHex(r) + componentToHex(g) + componentToHex(b), 16);
}
//http://stackoverflow.com/questions/43044/algorithm-to-randomly-generate-an-aesthetically-pleasing-color-palette
function randomPastelHex() {
    var mix = [255, 255, 255];
    var red = Math.floor(Math.random() * 256);
    var green = Math.floor(Math.random() * 256);
    var blue = Math.floor(Math.random() * 256);

    // mix the color
    red = Math.floor((red + 3 * mix[0]) / 4);
    green = Math.floor((green + 3 * mix[1]) / 4);
    blue = Math.floor((blue + 3 * mix[2]) / 4);

    return rgbToHex(red, green, blue);
}

module.exports = {
    randomPastelHex: randomPastelHex,
    rgbToHex: rgbToHex
};

/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var dot = __webpack_require__(23);
var dropout = __webpack_require__(24);
var nonlinear = __webpack_require__(27);
var input = __webpack_require__(25);
var regression = __webpack_require__(28);
var noise = __webpack_require__(26);
var bayesian = __webpack_require__(22);

var Size = __webpack_require__(1);
var Tensor = __webpack_require__(31);
var Optim = __webpack_require__(8);

var SharedConfiguration = __webpack_require__(4);

if (typeof window === 'undefined') {
	__webpack_require__(43);
}

// defines how the network looks; which layers etc.
class Model {

	constructor(opt) {
		this.representation = opt;
		this.build(opt);
	}

	build(opt) {
		this.layers = [];

		var input = null;
		var desc = Model.expand(opt);

		for (var i = 0; i < desc.length; i++) {
			var current = desc[i];
			var layer = Model.create(input, current);

			layer.label = current.label || undefined;
			layer.index = i;
			layer.model = this;
			layer.options = current;

			if (layer.dimensions.output) layer.size = layer.dimensions.output.length; // convenience

			this.layers.push(layer);
			input = layer.dimensions.output;
		}

		this.input = this.layers[0];
		this.output = this.layers[this.layers.length - 1];
	}

	newConfiguration() {
		return new Configuration(this);
	}

	newState() {
		return this.newConfiguration().newState();
	}

	numericalGradientCheck() {
		var config = this.newConfiguration();
		var state = config.newState();
		var diff = 1e-5;

		function clear() {
			// clear gradients
			for (var i = 0; i < config.parameters.length; i++) {
				if (config.parameters[i]) config.parameters[i].dw.fill(0.0);
			}
		}

		function analyse(param, index) {
			clear.call(this);

			state.forward(input);
			state.backward(output);

			return config.parameters[param].dw[index];
		}

		function loss() {
			state.forward(input);
			return state.loss(output);
		}

		function measure(param, index) {
			var orig = config.parameters[param].w[index];
			config.parameters[param].w[index] = orig - diff;
			var loss1 = loss.call(this);
			config.parameters[param].w[index] = orig + diff;
			var loss2 = loss.call(this);
			config.parameters[param].w[index] = orig;

			return (loss2 - loss1) / (2 * diff);
		}

		function checkWeight(param, index) {
			var analytical = analyse.call(this, param, index);
			var numerical = measure.call(this, param, index);
			var divisor = Math.abs(analytical);

			return Math.abs(numerical - analytical) / (divisor !== 0 ? divisor : 1);
		}

		var input = Float64Array.filled(this.input.size, 1.0);
		var output = Float64Array.filled(this.output.size, 1.0);

		console.log('Checking analytical gradients...'.magenta);

		var total = 0.0;
		for (var i = config.parameters.length - 1; i >= 0; i--) {
			var param = config.parameters[i];
			if (param === undefined) continue;

			var offset = 0.0;
			for (var j = 0; j < param.w.length; j++) {
				var error = checkWeight.call(this, i, j);
				if (isNaN(error)) {
					console.log('Layer ' + i);
					throw 'gradient is NaN';
				}

				offset += error * error;
			}

			total += offset;
			offset = Math.sqrt(offset) / param.w.length;

			console.log('Layer ' + i + ' with gradient error of ' + offset);

			if (offset > 1e-3) {
				throw 'analytical gradient unusually faulty';
			}
		}

		total = Math.sqrt(total) / config.countOfParameters;

		console.log(('Mean gradient error is ' + total).bold.cyan);
		console.log('Gradients are looking good!'.bold.white);
	}

	static expand(opt) {
		var description = [];
		for (var i = 0; i < opt.length; i++) {
			var current = opt[i];

			if (current.type === 'softmax' && current.classes) description.push({ type: 'fc', size: current.classes });

			description.push(current);

			if (current.activation) description.push({ type: current.activation });

			if (current.dropout) description.push({ type: 'dropout', probability: current.dropout });
		}

		if (!['softmax', 'regression'].includes(description[description.length - 1].type)) description.push({ type: 'regression' });

		return description;
	}

	static create(inp, opt) {
		switch (opt.type) {
			case 'fc':
				return new dot.FullyConnectedLayer(inp, opt);
			case 'dropout':
				return new dropout.DropOutLayer(inp, opt);
			case 'sigmoid':
				return new nonlinear.SigmoidLayer(inp, opt);
			case 'tanh':
				return new nonlinear.TanhLayer(inp, opt);
			case 'relu':
				return new nonlinear.ReLuLayer(inp, opt);
			case 'input':
				return new input.InputLayer(inp, opt);
			case 'regression':
				return new regression.RegressionLayer(inp, opt);
			case 'softmax':
				return new regression.SoftmaxLayer(inp, opt);
			case 'noise':
				return new noise.UhlenbeckOrnsteinNoiseLayer(inp, opt);
			case 'bayesian':
				return new bayesian.VariationalBayesianLayer(inp, opt);
			case 'conf':
				return new bayesian.ConfidenceLayer(inp, opt);
		}

		throw 'error';
	}

}

// defines how the network behaves; parameter/weights etc.
class Configuration {

	constructor(model, parameters, optimizer) {
		this.model = model;
		this.parameters = [];
		this.optimizer = null;
		this.countOfParameters = 0;

		for (var i = 0; i < this.model.layers.length; i++) {
			var layer = this.model.layers[i];
			if (!layer.dimensions.parameters) {
				continue;
			}

			var param = this.parameters[i] = new Tensor(layer.dimensions.parameters);
			if (parameters && i in parameters) // copy from
				param.w.set(parameters[i].w);else if (layer.initialize) // initialize as new parameters
				layer.initialize(param);else // random parameters
				param.w.randf(-1, 1);

			this.countOfParameters += layer.dimensions.parameters;
		}

		if (optimizer) {
			this.useOptimizer(optimizer);
		}
	}

	useOptimizer(optimizer) {
		if (optimizer.constructor === Object) optimizer = new Optim(optimizer);

		this.optimizer = optimizer;
		this.forEachParameter(param => optimizer.initialize(param));

		return optimizer;
	}

	freeze(val = true) {
		this.freezed = val;
	}

	optimize(accu = true) {
		if (accu) this.accumulate(Number.isInteger(accu) ? accu : undefined);
		this.forEachParameter(param => this.optimizer.apply(param));
	}

	accumulate(weighted) {
		this.forEachParameter(param => this.optimizer.accumulate(param, weighted));
	}

	forEachParameter(cb) {
		if (this.freezed) return;
		for (var i = 0; i < this.parameters.length; i++) {
			var param = this.parameters[i];
			if (param === undefined) continue;

			cb(param, i);
		}
	}

	copyParametersFrom(config) {
		if (config.model !== this.model) throw 'models must match';

		this.forEachParameter(function (param, index) {
			param.w.set(config.parameters[index].w);
		}.bind(this));
	}

	newState() {
		return new State(this);
	}

	clone() {
		return new Configuration(this.model, this.parameters, this.optimizer);
	}

	putWeights(arr) {
		var joined = arr;

		if (arr.length !== this.countOfParameters) throw 'array doesnt match';

		for (var i = 0, p = 0; i < this.parameters.length; i++) {
			var param = this.parameters[i];
			if (param === undefined) continue;

			param.w.set(joined.subarray(p, p + param.w.length));

			p += param.w.length;
		}
	}

	pullWeights() {
		var joined = new Float64Array(this.countOfParameters);

		for (var i = 0, p = 0; i < this.parameters.length; i++) {
			var param = this.parameters[i];
			if (param === undefined) continue;

			joined.set(param.w, p);

			p += param.w.length;
		}

		return joined;
	}

	share() {
		return new SharedConfiguration(this);
	}

}

// defines current network input/hidden/output-state; activations and gradients etc.
class State {

	constructor(configuration) {
		this.configuration = configuration;
		this.model = this.configuration.model;
		this.layers = this.model.layers;

		this.tensors = []; // array of layer tensors; this.tensors[i] = output tensor of layer i
		this.contexts = [];

		// First input + output of every layer
		for (var i = 0; i < this.layers.length + 1; i++) {
			if (i > 0 && this.layers[i - 1].passthrough) // if passthrough, just use last tensor
				this.tensors[i] = this.tensors[i - 1];else // if at i = layers.length, then use output of last layer as tensor size
				this.tensors[i] = new Tensor(i < this.layers.length ? this.layers[i].dimensions.input : this.layers[i - 1].dimensions.output);
		}

		for (var i = 0; i < this.layers.length; i++) {
			var layer = this.layers[i];
			var context = this.contexts[i] = new LayerContext({
				input: this.tensors[i],
				output: this.tensors[i + 1],
				parameters: this.configuration.parameters[i],
				state: this
			});

			Object.each(layer.storage || {}, function (k, v) {
				context[k] = new Float64Array(!isNaN(v) ? v : v.length);
			});
		}

		this.in = this.tensors[0];
		this.out = this.tensors[this.layers.length];

		this.__target = new Float64Array(this.out.w.length);
		this.__l_in = this.layers[0];
		this.__l_out = this.layers[this.layers.length - 1];
	}

	/**
  * Evaluate network
  * @param  {Float64Array} input
  * @return {Float64Array} 
  */
	forward(input, opt) {
		if (input != null) {
			this.__l_in.toInputVector(input, this.in.w); // use 'input' as input values, while converting it to a vector
		}

		this.options = opt || {}; // set pass options
		this.activate(); // activate all layers

		return this.output; // return copy of output
	}

	/**
  * Propagates error back, error is provided by subtracting desired from actual output values. 
  * @param  {Float64Array | Int} desired
  * @return {Float}         loss
  */
	backward(desired) {
		if (desired != null) {
			this.__l_out.toGradientVector(desired, this.out.w, this.out.dw); // convert 'desired' to target vector
		}

		this.propagate(); // propagate errors backwards

		return this.loss(desired); // return loss
	}

	/**
  * Instead of regressing the network to have minimal error, you can provide your own gradient.
  * @param  {Float64Array} grad
  */
	backwardWithGradient(grad) {
		if (Array.isArray(grad)) this.out.dw.set(grad);else if (this.out.dw.length === 1) this.out.dw[0] = grad;else throw 'error grad not propagatable';

		this.propagate();
	}

	// get copy of current output
	get output() {
		return this.__l_out.result(this.contexts[this.__l_out.index]);
	}

	// get loss of current 
	loss(desired) {
		if (desired === undefined) return;

		return this.__l_out.loss(this.contexts[this.__l_out.index], desired);
	}

	// not error gradient, but value gradient => how to increase/decrease n-th output value
	derivatives(n, clone = true) {
		this.out.dw.fill(0.0);
		this.out.dw[n] = 1.0;

		this.propagate();

		if (clone) return this.in.dw.clone();

		return this.in.dw;
	}

	// forward pass
	activate() {
		for (var i = 0; i < this.layers.length; i++) {
			if (this.layers[i].passthrough) continue;

			this.layers[i].forward(this.contexts[i]);
		}
	}

	// backwards pass
	propagate() {
		// safety check
		for (var i = 0; i < this.out.dw.length; i++) {
			if (isNaN(this.out.dw[i])) {
				throw 'warning: terror!';
			}
		}

		for (var i = this.layers.length - 1; i >= 0; i--) {
			if (this.layers[i].passthrough) continue;

			this.layers[i].backward(this.contexts[i]);
		}
	}

}

class LayerContext {

	constructor(opt) {
		this.input = opt.input;
		this.output = opt.output;
		this.params = opt.parameters;
		this.state = opt.state;
	}

}

module.exports = {
	Model, Configuration, State
};

/***/ }),
/* 4 */
/***/ (function(module, exports) {

class EventRadio {

	constructor() {
		this.events = {};
	}

	on(event, callback) {
		if (!(event in this.events)) {
			this.events[event] = [];
		}

		this.events[event].push(callback);
	}

	trigger(event, args = []) {
		if (event in this.events) {
			for (var i = 0; i < this.events[event].length; i++) {
				this.events[event][i].apply(undefined, [this].concat(args));
			}
		}
	}

}

class ConfigPool extends EventRadio {

	constructor(names) {
		super();
		this.states = {};
		this.configs = {};
		this.requested = [];
	}

	add(name, wrapper) {
		if (!(name in this.states)) {
			this.states[name] = [];
		}

		if (name in this.configs) {
			wrapper.set(this.configs[name]);
		}

		this.states[name].push(wrapper);
		wrapper.pool = this;
		wrapper.__pool_name = name;

		this.trigger('add', [wrapper, name]);
		this.trigger('add ' + name, [wrapper]);
	}

	set(name, config) {
		if (name in this.states) {

			for (var i = 0; i < this.states[name].length; i++) {
				this.states[name][i].set(config);
			}
		}

		this.configs[name] = config;
	}

	step() {
		for (var i = 0; i < this.requested.length; i++) {
			var name = this.requested[i];
			this.configs[name].optimize(false);
		}

		this.requested = [];
	}

	requestOptimisation(wrapper) {
		if (wrapper.__pool_name === undefined || !(wrapper.__pool_name in this.configs)) return false;

		if (this.requested.indexOf(wrapper.__pool_name) >= 0) return true;

		this.requested.push(wrapper.__pool_name);

		return true;
	}

}

class NetworkWrapper extends EventRadio {

	constructor() {
		super();

		this.on('set', () => {
			if (this.optim !== undefined) this.config.useOptimizer(this.optim);
		});
	}

	set(value) {
		var state;

		if (!value) {
			return;
		}

		if (value.constructor.name === 'State') {
			state = value;
		} else if (value.constructor.name === 'Configuration' || value.constructor.name === 'Model') {
			state = value.newState();
		}

		this.net = state;
		this.config = state.configuration;
		this.model = state.model;

		this.trigger('set', [state]);
	}

	useOptimizer(optim) {
		this.optim = optim;

		if (this.config) {
			this.config.useOptimizer(optim);
		}
	}

	optimize() {
		if (this.pool && this.pool.requestOptimisation(this)) {
			return;
		}

		this.config.optimize(false);
	}

}

module.exports = {
	NetworkWrapper, ConfigPool
};

/***/ }),
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

var car = __webpack_require__(6);

function agent(opt, world) {
    this.car = new car(world, {});
    this.options = opt;

    this.world = world;
    this.frequency = 15;
    this.reward = 0;
    this.rewardBonus = 0;
    this.loaded = false;

    this.loss = 0;
    this.timer = 0;
    this.timerFrequency = 60 / this.frequency;

    if (this.options.dynamicallyLoaded !== true) {
        this.init(null, null);
    }

    this.car.onContact = speed => {
        this.rewardBonus -= Math.max(speed, 50.0);
    };
};

agent.prototype.init = function (actor, critic) {
    var actions = 2;
    var temporal = 1;
    var states = this.car.states;

    var input = window.neurojs.Agent.getInputDimension(states, actions, temporal);

    this.brain = new window.neurojs.Agent({

        actor: actor,
        critic: critic,

        states: states,
        actions: actions,

        algorithm: 'ddpg',

        temporalWindow: temporal,

        discount: 0.95,

        experience: 75e3,
        learningPerTick: 40,
        startLearningAt: 900,

        theta: 0.05, // progressive copy

        alpha: 0.1 // advantage learning

    });

    this.world.brains.shared.add('actor', this.brain.algorithm.actor);
    this.world.brains.shared.add('critic', this.brain.algorithm.critic);

    this.actions = actions;
    this.car.addToWorld();
    this.loaded = true;
};

agent.prototype.step = function (dt) {
    if (!this.loaded) {
        return;
    }

    this.timer++;

    if (this.timer % this.timerFrequency === 0) {
        var d = this.car.updateSensors();
        var vel = this.car.chassisBody.velocity;
        var speed = this.car.speed.velocity;

        this.reward = Math.pow(vel[1], 2) - 0.1 * Math.pow(vel[0], 2) - this.car.contact * 10 - this.car.impact * 20;

        if (Math.abs(speed) < 1e-2) {
            // punish no movement; it harms exploration
            this.reward -= 1.0;
        }

        this.loss = this.brain.learn(this.reward);
        this.action = this.brain.policy(d);

        this.rewardBonus = 0.0;
        this.car.impact = 0;
    }

    if (this.action) {
        this.car.handle(this.action[0], this.action[1]);
    }

    return this.timer % this.timerFrequency === 0;
};

agent.prototype.draw = function (context) {};

module.exports = agent;

/***/ }),
/* 6 */
/***/ (function(module, exports, __webpack_require__) {

var color = __webpack_require__(2),
    sensors = __webpack_require__(19),
    tc = __webpack_require__(20);

function car(world, opt) {
    this.options = {
        sensors: [{ type: 'distance', angle: -45, length: 5 }, { type: 'distance', angle: -30, length: 5 }, { type: 'distance', angle: -15, length: 5 }, { type: 'distance', angle: +0, length: 5 }, { type: 'distance', angle: +15, length: 5 }, { type: 'distance', angle: +30, length: 5 }, { type: 'distance', angle: +45, length: 5 }, { type: 'distance', angle: -225, length: 3 }, { type: 'distance', angle: -195, length: 3 }, { type: 'distance', angle: -180, length: 5 }, { type: 'distance', angle: -165, length: 3 }, { type: 'distance', angle: -135, length: 3 }, { type: 'distance', angle: -10, length: 10 }, { type: 'distance', angle: -3, length: 10 }, { type: 'distance', angle: +0, length: 10 }, { type: 'distance', angle: +3, length: 10 }, { type: 'distance', angle: +10, length: 10 }, { type: 'distance', angle: +90, length: 7 }, { type: 'distance', angle: -90, length: 7 }, { type: 'speed' }]
    };

    this.maxSteer = Math.PI / 7;
    this.maxEngineForce = 10;
    this.maxBrakeForce = 5;
    this.maxBackwardForce = 2;
    this.linearDamping = 0.5;

    this.continuous = true;

    this.contact = 0;
    this.impact = 0;

    this.world = world;

    this.init();
};

car.TYPE = 2;

car.prototype.init = function () {
    this.createPhysicalBody();

    this.sensors = sensors.build(this, this.options.sensors);
    this.speed = this.sensors[this.sensors.length - 1];

    this.states = 0; // sensor dimensonality

    for (var i = 0; i < this.sensors.length; i++) {
        this.states += this.sensors[i].dimensions;
    }

    this.punishment = 0;
    this.timer = 0.0;
};

car.prototype.createPhysicalBody = function () {
    // Create a dynamic body for the chassis
    this.chassisBody = new p2.Body({
        mass: 1,
        damping: 0.2,
        angularDamping: 0.3
    });

    this.wheels = {};
    this.chassisBody.color = color.randomPastelHex();
    this.chassisBody.car = true;
    this.chassisBody.damping = this.linearDamping;

    var boxShape = new p2.Box({ width: 0.5, height: 1 });
    boxShape.entity = 2;

    this.chassisBody.addShape(boxShape);
    this.chassisBody.gl_create = function (sprite, r) {
        this.overlay = new PIXI.Graphics();
        this.overlay.visible = true;

        sprite.addChild(this.overlay);

        var wheels = new PIXI.Graphics();
        sprite.addChild(wheels);

        var w = 0.12,
            h = 0.22;
        var space = 0.07;
        var col = "#" + this.chassisBody.color.toString(16);
        col = parseInt(tc(col).darken(50).toHex(), 16);
        var alpha = 0.35,
            alphal = 0.9;

        var tl = new PIXI.Graphics();
        var tr = new PIXI.Graphics();

        tl.beginFill(col, alpha);
        tl.position.x = -0.25;
        tl.position.y = 0.5 - h / 2 - space;
        tl.drawRect(-w / 2, -h / 2, w, h);
        tl.endFill();

        tr.beginFill(col, alpha);
        tr.position.x = 0.25;
        tr.position.y = 0.5 - h / 2 - space;
        tr.drawRect(-w / 2, -h / 2, w, h);
        tr.endFill();

        this.wheels.topLeft = tl;
        this.wheels.topRight = tr;

        wheels.addChild(tl);
        wheels.addChild(tr);

        wheels.beginFill(col, alpha);
        // wheels.lineStyle(0.01, col, alphal)
        wheels.drawRect(-0.25 - w / 2, -0.5 + space, w, h);
        wheels.endFill();

        wheels.beginFill(col, alpha);
        // wheels.lineStyle(0.01, col, alphal)
        wheels.drawRect(0.25 - w / 2, -0.5 + space, w, h);
        wheels.endFill();
    }.bind(this);

    // Create the vehicle
    this.vehicle = new p2.TopDownVehicle(this.chassisBody);

    // Add one front wheel and one back wheel - we don't actually need four :)
    this.frontWheel = this.vehicle.addWheel({
        localPosition: [0, 0.5] // front
    });
    this.frontWheel.setSideFriction(50);

    // Back wheel
    this.backWheel = this.vehicle.addWheel({
        localPosition: [0, -0.5] // back
    });
    this.backWheel.setSideFriction(45); // Less side friction on back wheel makes it easier to drift
};

car.prototype.updateSensors = function () {
    var data = new Float64Array(this.states);
    for (var i = 0, k = 0; i < this.sensors.length; k += this.sensors[i].dimensions, i++) {
        this.sensors[i].update();
        data.set(this.sensors[i].read(), k);
    }

    if (k !== this.states) {
        throw 'unexpected';
    }

    this.drawSensors();

    return data;
};

car.prototype.drawSensors = function () {
    if (this.overlay.visible !== true) {
        return;
    }

    this.overlay.clear();

    for (var i = 0; i < this.sensors.length; i++) {
        this.sensors[i].draw(this.overlay);
    }
};

car.prototype.addToWorld = function () {
    this.chassisBody.position[0] = (Math.random() - .5) * this.world.size.w;
    this.chassisBody.position[1] = (Math.random() - .5) * this.world.size.h;
    this.chassisBody.angle = (Math.random() * 2.0 - 1.0) * Math.PI;

    this.world.p2.addBody(this.chassisBody);
    this.vehicle.addToWorld(this.world.p2);

    this.world.p2.on("beginContact", event => {

        if (event.bodyA === this.chassisBody || event.bodyB === this.chassisBody) {
            // this.onContact( Math.pow(this.chassisBody.velocity[1], 2) + Math.pow(this.chassisBody.velocity[0], 2) );
            this.contact++;
        }
    });

    this.world.p2.on("endContact", event => {

        if (event.bodyA === this.chassisBody || event.bodyB === this.chassisBody) {
            this.contact--;
        }
    });

    this.world.p2.on("impact", event => {

        if (event.bodyA === this.chassisBody || event.bodyB === this.chassisBody) {
            this.impact = Math.sqrt(Math.pow(this.chassisBody.velocity[0], 2) + Math.pow(this.chassisBody.velocity[1], 2));
        }
    });
};

car.prototype.handleKeyInput = function (k) {
    // Steer value zero means straight forward. Positive is left and negative right.
    // this.frontWheel.steerValue = this.maxSteer * (k.getN(37) - k.getN(39));

    // // Engine force forward
    // this.backWheel.engineForce = k.getN(38) * this.maxEngineForce;
    // this.backWheel.setBrakeForce(0);

    // if(k.get(40)) {
    //     if(this.backWheel.getSpeed() > 0.1){
    //         // Moving forward - add some brake force to slow down
    //         this.backWheel.setBrakeForce(this.maxBrakeForce);
    //     } else {
    //         // Moving backwards - reverse the engine force
    //         this.backWheel.setBrakeForce(0);
    //         this.backWheel.engineForce = -this.maxBackwardForce;
    //     }
    // }

    if (k.getD(83) === 1) {
        this.overlay.visible = !this.overlay.visible;
    }
};

car.prototype.handle = function (throttle, handlebar) {

    // Steer value zero means straight forward. Positive is left and negative right.
    this.frontWheel.steerValue = this.maxSteer * handlebar;

    // Engine force forward
    var force = throttle * this.maxEngineForce;
    if (force < 0) {

        if (this.backWheel.getSpeed() > 0.1) {
            this.backWheel.setBrakeForce(-throttle * this.maxBrakeForce);
            this.backWheel.engineForce = 0.0;
        } else {
            this.backWheel.setBrakeForce(0);
            this.backWheel.engineForce = throttle * this.maxBackwardForce;
        }
    } else {
        this.backWheel.setBrakeForce(0);
        this.backWheel.engineForce = force;
    }

    this.wheels.topLeft.rotation = this.frontWheel.steerValue * 0.7071067812;
    this.wheels.topRight.rotation = this.frontWheel.steerValue * 0.7071067812;
};

module.exports = car;

/***/ }),
/* 7 */
/***/ (function(module, exports) {

function keyboard() {
    this.handlers = {};
    this.subscribers = [];
    this.states = {};

    document.onkeydown = this.keydown.bind(this);
    document.addEventListener('keydown', this.keydown.bind(this), true);
    document.addEventListener('keyup', this.keyup.bind(this), true);
}

keyboard.prototype.keydown = function (e) {
    this.states[e.keyCode] = this.states[e.keyCode] !== undefined ? this.states[e.keyCode] + 1 : 1;

    if (this.handlers[e.keyCode]) {
        this.handlers[e.keyCode](true);
    }

    for (var i = 0; i < this.subscribers.length; i++) {
        this.subscribers[i](this);
    }
};

keyboard.prototype.keyup = function (e) {
    this.states[e.keyCode] = 0;

    if (this.handlers[e.keyCode]) {
        this.handlers[e.keyCode](false);
    }

    for (var i = 0; i < this.subscribers.length; i++) {
        this.subscribers[i](this);
    }
};

keyboard.prototype.listen = function (key, callback) {
    this.handlers[key] = callback;
};

keyboard.prototype.subscribe = function (callback) {
    this.subscribers.push(callback);
};

keyboard.prototype.get = function (key) {
    if (this.states[key]) return this.states[key] > 0;

    return false;
};

keyboard.prototype.getN = function (key) {
    if (this.states[key]) return this.states[key] > 0 ? 1 : 0;

    return 0;
};

keyboard.prototype.getD = function (key) {
    if (this.states[key]) return this.states[key];

    return 0;
};

module.exports = keyboard;

/***/ }),
/* 8 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.assign(RegExp, {

    escape(str) {
        return str.replace(/([.*+?^=!:${}()|\[\]\/\\])/g, "\\$1");
    }

});

Object.assign(Function.prototype, {

    getArguments() {
        const STRIP_COMMENTS = /((\/\/.*$)|(\/\*[\s\S]*?\*\/))/mg;
        const ARGUMENT_NAMES = /([^\s,]+)/g;

        if (this.$args) return this.$args;

        var fnStr = this.toString().replace(STRIP_COMMENTS, '');
        var result = fnStr.slice(fnStr.indexOf('(') + 1, fnStr.indexOf(')')).match(ARGUMENT_NAMES);
        if (result === null) result = [];

        return this.$args = result;
    },

    getSource() {
        return this.toString().replace(/^[^{]+{/i, '').replace(/}[^}]*$/i, '');
    },

    decompile() {
        return { arguments: this.getArguments(), source: this.getSource() };
    }

});

Object.assign(Object, {

    each(obj, callback) {
        for (var key in obj) if (obj.hasOwnProperty(key)) callback(key, obj[key]);
    }

});

Object.assign(String.prototype, {

    replaceAll(find, replace) {
        return this.replace(new RegExp(RegExp.escape(find), 'g'), replace);
    }

});

/**
 * How to use this optimizer:
 *
 * 1. First initialize with options e.g.
 *     var optimizer = new Optim({
 *         method: 'adadelta',
 *         regularization: { l2: 1e-2 },
 *         clipping: 5
 *     })
 * 2. Then create a (weight) tensor:
 *     var toOptimize = new Tensor(100)
 * 3. And prepare the tensor for optimization
 *     optimizer.initialize(toOptimize)
 * 4. Then add a gradient to the tensor (not practical like this, but you get the hang of it)
 *     toOptimize.dw[50] = 1.0
 * 5. Accumulate gradient (do this n-times if n is your batch count)
 *     optimizer.accumulate(toOptimize)
 * 6. Finally apply gradient optimization via
 *     optimizer.apply(toOptimize)
 * 
 */

class Optim {

    constructor(opt) {
        this.update(opt || {});
        this.uuid = ++Optim.INDEX;
    }

    update(opt) {
        this.method = opt.method || 'sgd';
        this.options = Object.assign({

            type: 'descent',
            clipping: 0,
            regularization: {
                l1: 0,
                l2: 0
            }

        }, Optim.methods[this.method].options, opt);

        delete this.options.method;

        this.options = Object.freeze(this.options);

        this.build();
    }

    build() {
        if (this.options.type === 'descent') this.apply = this.assemble('-');else if (this.options.type === 'ascent') this.apply = this.assemble('+');else throw 'unrecognized optimizer type';
    }

    assemble(dir) {
        var method = Optim.methods[this.method];
        var regDir = dir === '+' ? '-' : '+';

        var performer = (method.deliver ? method.deliver(this.options) : method.perform).decompile();
        var stateDefs = [],
            produceDefs = [];

        this.states = performer.arguments;

        for (var i = 0; i < this.states.length; i++) {
            stateDefs.push(this.states[i] + '=' + 'dw.' + this.states[i]);
        }

        function _definitions() {
            var defs = '';
            if (stateDefs.length > 0) defs += 'var ' + stateDefs.join(',') + ';';

            if (produceDefs.length > 0) defs += 'var ' + produceDefs.join(',') + ';';

            return defs;
        }

        function _gradient() {
            var producer = '';
            if (this.options.clipping > 0) {
                producer += 'grad = grad > opt.clipping ? opt.clipping : (grad < -opt.clipping ? -opt.clipping : grad);\n';
            }

            var sum = 'grad';
            if (this.options.regularization.l1 > 0) {
                produceDefs.push('l1grad');
                producer += 'l1grad = opt.regularization.l1 * (w[i] > 0 ? ' + regDir + '1 : ' + dir + '1);\n';
                sum += '+l1grad';
            }

            if (this.options.regularization.l2 > 0) {
                produceDefs.push('l2grad');
                producer += 'l2grad = opt.regularization.l2 * w[i] * ' + regDir + '1.0;\n';
                sum += '+l2grad';
            }

            producer += 'gij = ' + '(' + sum + ') / iteration' + ';\n';

            return { source: producer };
        }

        function replaceOptionsWithConstants(k, v) {
            if (typeof v === 'object') {
                Object.each(v, replaceOptionsWithConstants.bind(this + k + '.'));
                return;
            }

            fn = fn.replaceAll(this + k, v);
        }

        var grad = _gradient.call(this);

        var fn = `"use strict";
            var w = tensor.w, dw = tensor.dw, accdw = dw.acc;
            var dx, gij, grad, iteration = dw.iteration;
            if (iteration < 1) return ;
            ${_definitions()}
            for (var i = 0; i < w.length; ++i) {
                grad = accdw[i];
                ${grad.source}
                ${performer.source}
                w[i] ${dir}= dx;
                accdw[i] = 0.0;
            }
            dw.iteration = 0;`;

        Object.each(this.options, replaceOptionsWithConstants.bind('opt.'));
        return new Function('tensor', fn);
    }

    accumulate(tensor, weighted) {
        weighted = weighted || 1;
        var w = tensor.w,
            dw = tensor.dw,
            accdw = dw.acc;
        var dx,
            gij,
            grad,
            iteration = dw.iteration += weighted;
        for (var i = 0; i < w.length; ++i) accdw[i] += weighted * dw[i];
    }

    initialize(tensor, set, linked) {
        if (!tensor.initialized) {
            // general initialization
            tensor.dw.iteration = 0;
            tensor.dw.acc = new Float64Array(tensor.dw.length);
        }

        for (var i = 0; i < this.states.length; ++i) {
            // specific (algorithm dependent) initialization
            if (this.states[i] in tensor.dw) tensor.dw[this.states[i]] = tensor.dw[this.states[i]].fill(0.0);else tensor.dw[this.states[i]] = new Float64Array(tensor.dw.length);
        }

        tensor.initialized = true;
    }

    static register(name, value) {
        Optim.methods[name] = value;
    }

}

Optim.methods = {};

Optim.register("sgd", {

    deliver(opt) {
        if (opt.momentum === 0) {
            return function () {
                dx = opt.rate * gij;
            };
        }

        return this.perform;
    },

    perform(mom) {
        dx = opt.rate * gij + opt.momentum * mom[i];
        mom[i] = dx;
    },

    options: {
        rate: 0.01,
        momentum: 0
    }

});

Optim.register("adadelta", {

    perform(gsum, xsum) {
        gsum[i] = opt.ro * gsum[i] + (1 - opt.ro) * gij * gij;
        dx = Math.sqrt((xsum[i] + opt.eps) / (gsum[i] + opt.eps)) * gij;
        xsum[i] = opt.ro * xsum[i] + (1 - opt.ro) * dx * dx; // yes, xsum lags behind gsum by 1.
    },

    options: {
        ro: 0.95,
        eps: 1e-8
    }

});

Optim.register("adam", {

    perform(m, v) {
        m[i] = opt.beta1 * m[i] + (1 - opt.beta1) * gij; // update biased first moment estimate
        v[i] = opt.beta2 * v[i] + (1 - opt.beta2) * gij * gij; // update biased second moment estimate
        var bcm = m[i] / (1 - Math.pow(opt.beta1, iteration)); // correct bias first moment estimate
        var bcv = v[i] / (1 - Math.pow(opt.beta2, iteration)); // correct bias second moment estimate
        dx = opt.rate * bcm / (Math.sqrt(bcv) + opt.eps);
    },

    options: {
        rate: 0.01,
        eps: 1e-8,
        beta1: 0.9,
        beta2: 0.999
    }

});

Optim.INDEX = 0;

module.exports = Optim;

/***/ }),
/* 9 */
/***/ (function(module, exports) {


class Algorithm {

	// what to do?
	act(state, target) {
		throw 'Not implemented';
	}

	// how good is an action at state
	value(state, action, target) {
		throw 'Not implemented';
	}

	// replay
	optimize(e, descent = true) {
		throw 'Not implemented';
	}

	// adjust weights etc
	learn() {
		throw 'Not implemented';
	}

	import(params) {
		throw 'Not implemented';
	}
	export() {
		throw 'Not implemented';
	}

	evaluate(state, target) {
		return this.value(state, this.act(state, target), target);
	}

}

module.exports = Algorithm;

/***/ }),
/* 10 */
/***/ (function(module, exports) {

class ReplayBuffer {

	add(e) {
		throw 'not implemented';
	}
	sample(n) {
		throw 'not implemented';
	}
	getAverageLoss() {
		throw 'not implemented';
	}
	getImportanceSamplingWeight(e) {
		return 1.0;
	}
	updateAfterLearning() {}

}

class UniformReplayBuffer extends ReplayBuffer {

	constructor(size) {
		super();
		this.buffer = [];
		this.size = size;
	}

	add(e) {

		if (this.buffer.length >= this.size) {
			this.buffer[Math.randi(0, this.buffer.length)] = e;
		} else {
			this.buffer.push(e);
		}
	}

	sample(n) {
		var batch = [];

		if (this.buffer.length <= n) return this.buffer;

		for (var i = 0; i < n; i++) {
			batch.push(Array.random(this.buffer));
		}

		return batch;
	}

	draw() {
		return Array.random(this.buffer);
	}

	getAverageLoss() {
		return Array.sum(this.buffer, x => x.loss) / this.buffer.length;
	}

}

class PrioritizedReplayBuffer extends ReplayBuffer {

	constructor(N) {
		super();

		this.root = new PrioritizedReplayBuffer.Node(null, null);
		this.iterations = 0;
		this.size = 0;

		this.maxISW = 1.0;
		this.beta = 0.5;

		for (var i = 0; i < N - 1; ++i) {
			this.root.add(null);
		}

		this.leafs = this.root.getLeafs();

		if (this.leafs.length !== this.root.size) throw 'could not create replay tree...';
	}

	add(e) {
		if (this.size === this.leafs.length) {
			this.root.descent((a, b) => a.minimum < b.minimum ? 0 : 1).set(e);
		} else {
			this.leafs[this.size].set(e);
		}

		this.iterations += 1;
		this.size = Math.max(this.size, this.iterations % this.leafs.length);
	}

	sample(n) {
		var batch = [];

		this.maxISW = Math.pow(this.size * (this.root.minimum / this.root.value), -this.beta);

		if (this.size < 5 * n) return [];

		while (batch.length < n) batch.push(this.root.cumulativeSample(Math.random() * this.root.value).experience);

		return batch;
	}

	draw(prioritised) {
		if (!prioritised) return this.leafs[Math.randi(0, this.size)].experience;

		return this.root.cumulativeSample(Math.random() * this.root.value).experience;
	}

	updateAfterLearning(batch) {
		for (var i = 0; i < batch.length; i++) {
			var e = batch[i];
			if (e !== e.node.experience) throw 'association error';

			e.node.revalue();
		}
	}

	getImportanceSamplingWeight(e) {
		if (e.priority === undefined) return 1.0;

		return Math.pow(this.size * (e.priority / this.root.value), -this.beta);
	}

	getAverageLoss() {
		return this.root.value / this.root.size;
	}

}

PrioritizedReplayBuffer.Node = class Node {

	constructor(parent, experience) {
		this.parent = parent;
		this.children = [];
		this.size = 1;
		this.value = 0.0;

		this.maximum = -Infinity;
		this.minimum = Infinity;

		this.experience = experience;
		this.revalue();
	}

	cumulativeSample(x) {
		if (this.children.length === 0) return this;

		if (this.children[0].value < x) return this.children[1].cumulativeSample(x - this.children[0].value);else return this.children[0].cumulativeSample(x);
	}

	update() {
		this.value = Array.sum(this.children, x => x.value);
		this.maximum = this.children.reduce((a, b) => a.maximum > b.maximum ? a : b).maximum;
		this.minimum = this.children.reduce((a, b) => a.minimum < b.minimum ? a : b).minimum;

		if (this.parent) this.parent.update();
	}

	revalue() {
		if (this.children.length > 0) throw 'not possible';

		if (!this.experience) return;

		this.value = this.experience.priority || Infinity;

		this.maximum = this.value;
		this.minimum = this.value;

		if (this.parent) this.parent.update();
	}

	set(experience) {
		if (this.children.length > 0) throw "can't set experience of node with children";

		experience.node = this;

		this.experience = experience;
		this.revalue();
	}

	add(experience) {
		if (this.children.length === 0) {
			// branch off
			this.children.push(new PrioritizedReplayBuffer.Node(this, this.experience));
			this.children.push(new PrioritizedReplayBuffer.Node(this, experience));
			this.experience = null;

			// this.update()
		} else {
			this.children.reduce((a, b) => a.size < b.size ? a : b).add(experience);
		}

		this.size++;
	}

	descent(dir) {
		if (this.children.length === 0) return this;

		return this.children[dir(this.children[0], this.children[1])].descent(dir);
	}

	getLeafs() {
		if (this.children.length === 0) return [this];

		var unfolded = [];
		for (var i = 0; i < this.children.length; i++) {
			unfolded.push(this.children[i].getLeafs());
		}

		return Array.prototype.concat.apply([], unfolded);
	}

};

module.exports = {

	ReplayBuffer,
	UniformReplayBuffer,
	PrioritizedReplayBuffer

};

/***/ }),
/* 11 */
/***/ (function(module, exports, __webpack_require__) {

var binary = __webpack_require__(12);
var network = __webpack_require__(3);

class NetOnDisk {

	static write(config) {
		var contents = [];

		contents.push(config.model.representation);
		contents.push(config.pullWeights());

		return binary.Writer.write(contents);
	}

	static read(buffer) {
		var contents = binary.Reader.read(buffer);

		var model = new network.Model(contents[0]);
		var config = model.newConfiguration();

		config.putWeights(contents[1]);

		return config;
	}

	static writeMultiPart(list) {
		var contents = [];

		contents.push(Object.keys(list));

		for (var name in list) {
			var config = list[name];

			if (!config instanceof network.Configuration) {
				throw 'config in list must be of type Network.Configuration';
			}

			contents.push(name);
			contents.push(config.model.representation);
			contents.push(config.pullWeights());
		}

		return binary.Writer.write(contents);
	}

	static readMultiPart(buffer) {
		var contents = binary.Reader.read(buffer);

		var ptr = -1;
		var names = contents[++ptr];

		var list = {};

		for (var i = 0; i < names.length; i++) {
			var name = names[i];

			if (contents[++ptr] !== name) {
				throw 'name does not match up';
			}

			var model = new network.Model(contents[++ptr]);
			var config = model.newConfiguration();

			config.putWeights(contents[++ptr]);

			list[name] = config;
		}

		return list;
	}

}

module.exports = NetOnDisk;

/***/ }),
/* 12 */
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(global) {var StringView = __webpack_require__(39);

function isObjLiteral(_obj) {
	var _test = _obj;
	return typeof _obj !== 'object' || _obj === null ? false : function () {
		while (!false) {
			if (Object.getPrototypeOf(_test = Object.getPrototypeOf(_test)) === null) {
				break;
			}
		}
		return Object.getPrototypeOf(_obj) === _test;
	}();
}

class BinaryWriter {

	/**
  * Returns array buffer, which contains the binary data.
  * @param  {array} contents
  * @return {ArrayBuffer} 
  */
	static write(contents) {
		var toc = [],
		    length = 0;

		for (var i = 0; i < contents.length; i++) {
			var value = contents[i];
			var isobject = false;

			if (value.constructor === Object || value.constructor === Array) {
				value = contents[i] = JSON.stringify(value);
				isobject = true;
			}

			if (typeof value === 'string') {
				toc.push({
					t: 's',
					l: value.length
				});

				if (isobject) {
					toc[toc.length - 1]['o'] = 1;
				}

				length += value.length;
			} else if (ArrayBuffer.isView(value)) {
				toc.push({
					t: 't',
					l: value.byteLength,
					i: value.constructor.name
				});

				length += value.byteLength;
			} else if (value instanceof ArrayBuffer) {
				toc.push({
					t: 'b',
					l: value.byteLength
				});

				length += value.byteLength;
			}
		}

		var jsonified = JSON.stringify(toc);

		length += jsonified.length + Uint32Array.BYTES_PER_ELEMENT + 1;

		var writer = new BinaryWriter(length);

		writer.setUint8(BinaryWriter.validationByte); // validation byte
		writer.setUint32(jsonified.length); // table of contents length
		writer.setString(jsonified); // ToC

		for (var i = 0; i < toc.length; i++) {
			switch (toc[i].t) {
				case 's':
					writer.setString(contents[i]);break;
				case 't':
					writer.setTypedArray(contents[i]);break;
				case 'b':
					writer.setBuffer(contents[i]);break;
			}
		}

		if (!writer.isAtEnd()) {
			throw "The lengths don't match up";
		}

		return writer.raw;
	}

	constructor(length) {
		this.array = new Uint8Array(length);
		this.buffer = this.array.buffer;
		this.dataView = new DataView(this.buffer);
		this.index = 0;
	}

	setUint8(val) {
		this.dataView.setUint8(this.index, val);
		this.index += Uint8Array.BYTES_PER_ELEMENT;
	}

	setUint32(val) {
		this.dataView.setUint32(this.index, val);
		this.index += Uint32Array.BYTES_PER_ELEMENT;
	}

	setString(string) {
		var sv = new StringView(string);
		this.array.set(sv.rawData, this.index);
		this.index += sv.buffer.byteLength;
	}

	setTypedArray(arr) {
		this.array.set(new Uint8Array(arr.buffer), this.index);
		this.index += arr.byteLength;
	}

	setBuffer(buf) {
		this.array.set(new Uint8Array(buf), this.index);
		this.index += buf.byteLength;
	}

	isAtEnd() {
		return this.buffer.byteLength === this.index;
	}

	get raw() {
		return this.array.buffer;
	}

}

class BinaryReader {

	/**
  * Returns the contents read from the array buffer
  * @param  {ArrayBuffer} buffer
  * @return {array}      
  */
	static read(buffer) {
		var reader = new BinaryReader(buffer);

		var validation = reader.getUint8();

		if (validation !== BinaryWriter.validationByte) {
			throw "validation byte doesn't match.";
		}

		var tocLength = reader.getUint32();
		var tocString = reader.getString(tocLength);
		var toc = JSON.parse(tocString);
		var contents = [];

		for (var i = 0; i < toc.length; i++) {
			switch (toc[i].t) {
				case 's':
					contents.push(reader.getString(toc[i].l));break;
				case 't':
					contents.push(new (typeof window !== 'undefined' ? window : global)[toc[i].i](reader.getBuffer(toc[i].l)));break;
				case 'b':
					contents.push(reader.getBuffer(toc[i].l));break;
			}

			if (toc[i]['o'] === 1) {
				contents[i] = JSON.parse(contents[i]);
			}
		}

		return contents;
	}

	constructor(buffer) {
		this.array = new Uint8Array(buffer);
		this.buffer = buffer;
		this.dataView = new DataView(buffer);
		this.index = 0;
	}

	getUint8() {
		var val = this.dataView.getUint8(this.index);
		this.index += Uint8Array.BYTES_PER_ELEMENT;

		return val;
	}

	getUint32() {
		var val = this.dataView.getUint32(this.index);
		this.index += Uint32Array.BYTES_PER_ELEMENT;

		return val;
	}

	getString(length) {
		var arr = this.array.subarray(this.index, this.index + length);
		var str = new StringView(arr).toString();

		this.index += arr.byteLength;

		return str;
	}

	getBuffer(byteLength) {
		var arr = this.array.slice(this.index, this.index + byteLength);
		this.index += byteLength;

		return arr.buffer;
	}

	isAtEnd() {
		return this.buffer.byteLength === this.index;
	}

}

BinaryWriter.validationByte = 0x8F;

module.exports = {
	'Writer': BinaryWriter,
	'Reader': BinaryReader
};
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(50)))

/***/ }),
/* 13 */
/***/ (function(module, exports) {

function webpackEmptyContext(req) {
	throw new Error("Cannot find module '" + req + "'.");
}
webpackEmptyContext.keys = function() { return []; };
webpackEmptyContext.resolve = webpackEmptyContext;
module.exports = webpackEmptyContext;
webpackEmptyContext.id = 13;


/***/ }),
/* 14 */
/***/ (function(module, exports) {

// shim for using process in browser
var process = module.exports = {};

// cached from whatever global is present so that test runners that stub it
// don't break things.  But we need to wrap it in a try catch in case it is
// wrapped in strict mode code which doesn't define any globals.  It's inside a
// function because try/catches deoptimize in certain engines.

var cachedSetTimeout;
var cachedClearTimeout;

function defaultSetTimout() {
    throw new Error('setTimeout has not been defined');
}
function defaultClearTimeout () {
    throw new Error('clearTimeout has not been defined');
}
(function () {
    try {
        if (typeof setTimeout === 'function') {
            cachedSetTimeout = setTimeout;
        } else {
            cachedSetTimeout = defaultSetTimout;
        }
    } catch (e) {
        cachedSetTimeout = defaultSetTimout;
    }
    try {
        if (typeof clearTimeout === 'function') {
            cachedClearTimeout = clearTimeout;
        } else {
            cachedClearTimeout = defaultClearTimeout;
        }
    } catch (e) {
        cachedClearTimeout = defaultClearTimeout;
    }
} ())
function runTimeout(fun) {
    if (cachedSetTimeout === setTimeout) {
        //normal enviroments in sane situations
        return setTimeout(fun, 0);
    }
    // if setTimeout wasn't available but was latter defined
    if ((cachedSetTimeout === defaultSetTimout || !cachedSetTimeout) && setTimeout) {
        cachedSetTimeout = setTimeout;
        return setTimeout(fun, 0);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedSetTimeout(fun, 0);
    } catch(e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't trust the global object when called normally
            return cachedSetTimeout.call(null, fun, 0);
        } catch(e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error
            return cachedSetTimeout.call(this, fun, 0);
        }
    }


}
function runClearTimeout(marker) {
    if (cachedClearTimeout === clearTimeout) {
        //normal enviroments in sane situations
        return clearTimeout(marker);
    }
    // if clearTimeout wasn't available but was latter defined
    if ((cachedClearTimeout === defaultClearTimeout || !cachedClearTimeout) && clearTimeout) {
        cachedClearTimeout = clearTimeout;
        return clearTimeout(marker);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedClearTimeout(marker);
    } catch (e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't  trust the global object when called normally
            return cachedClearTimeout.call(null, marker);
        } catch (e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error.
            // Some versions of I.E. have different rules for clearTimeout vs setTimeout
            return cachedClearTimeout.call(this, marker);
        }
    }



}
var queue = [];
var draining = false;
var currentQueue;
var queueIndex = -1;

function cleanUpNextTick() {
    if (!draining || !currentQueue) {
        return;
    }
    draining = false;
    if (currentQueue.length) {
        queue = currentQueue.concat(queue);
    } else {
        queueIndex = -1;
    }
    if (queue.length) {
        drainQueue();
    }
}

function drainQueue() {
    if (draining) {
        return;
    }
    var timeout = runTimeout(cleanUpNextTick);
    draining = true;

    var len = queue.length;
    while(len) {
        currentQueue = queue;
        queue = [];
        while (++queueIndex < len) {
            if (currentQueue) {
                currentQueue[queueIndex].run();
            }
        }
        queueIndex = -1;
        len = queue.length;
    }
    currentQueue = null;
    draining = false;
    runClearTimeout(timeout);
}

process.nextTick = function (fun) {
    var args = new Array(arguments.length - 1);
    if (arguments.length > 1) {
        for (var i = 1; i < arguments.length; i++) {
            args[i - 1] = arguments[i];
        }
    }
    queue.push(new Item(fun, args));
    if (queue.length === 1 && !draining) {
        runTimeout(drainQueue);
    }
};

// v8 likes predictible objects
function Item(fun, array) {
    this.fun = fun;
    this.array = array;
}
Item.prototype.run = function () {
    this.fun.apply(null, this.array);
};
process.title = 'browser';
process.browser = true;
process.env = {};
process.argv = [];
process.version = ''; // empty string to avoid regexp issues
process.versions = {};

function noop() {}

process.on = noop;
process.addListener = noop;
process.once = noop;
process.off = noop;
process.removeListener = noop;
process.removeAllListeners = noop;
process.emit = noop;

process.binding = function (name) {
    throw new Error('process.binding is not supported');
};

process.cwd = function () { return '/' };
process.chdir = function (dir) {
    throw new Error('process.chdir is not supported');
};
process.umask = function() { return 0; };


/***/ }),
/* 15 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = {
	agent: __webpack_require__(5),
	car: __webpack_require__(6),
	dispatcher: __webpack_require__(17),
	keyboard: __webpack_require__(7),
	renderer: __webpack_require__(18),
	world: __webpack_require__(21)
};

/***/ }),
/* 16 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


if (!__webpack_require__(38)()) {
	throw 'env unsupported';
}

__webpack_require__(30);

var neurojs = {

	Network: __webpack_require__(3),
	Agent: __webpack_require__(33),
	Optim: __webpack_require__(8),
	Loader: __webpack_require__(29),
	Buffers: __webpack_require__(10),
	NetOnDisk: __webpack_require__(11),
	FileLoader: __webpack_require__(37),
	Binary: __webpack_require__(12),
	Shared: __webpack_require__(4)

};

if (typeof window !== 'undefined') {
	window.neurojs = neurojs;
} else {
	module.exports = neurojs;
}

/***/ }),
/* 17 */
/***/ (function(module, exports, __webpack_require__) {

var requestAnimFrame = window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.oRequestAnimationFrame || window.msRequestAnimationFrame || function (callback) {
    window.setTimeout(callback, 1000 / 60);
};
var keyboard = __webpack_require__(7);

function dispatcher(renderer, world) {
    this.renderer = renderer;
    this.world = world;
    this.running = true;
    this.interval = false;
    this.step = 0;

    this.keyboard = new keyboard();
    this.keyboard.subscribe(function (k) {
        for (var i = 0; i < this.world.agents.length; i++) {
            this.world.agents[i].car.handleKeyInput(k);
        }

        // if (k.get(189)) {
        //     this.renderer.zoom(0.9);
        // }

        // if (k.get(187)) {
        //     this.renderer.zoom(1.1);
        // }
    }.bind(this));

    this.__loop = this.loop.bind(this);
}

dispatcher.prototype.dt = function () {
    var now = Date.now();
    var diff = now - (this.prev || now);
    this.prev = now;

    return diff / 1000;
};

dispatcher.prototype.loop = function () {
    if (this.running && !this.interval) {
        // start next timer
        requestAnimFrame(this.__loop);
    }

    var dt = 1.0 / 60.0;

    // compute phyiscs
    this.world.step(dt);
    this.step++;

    // draw everything
    if (!this.interval || this.step % 5 === 0) this.renderer.render();
};

dispatcher.prototype.begin = function () {
    this.running = true;

    if (this.__interval && !this.interval) clearInterval(this.__interval);

    if (this.interval) this.__interval = setInterval(this.__loop, 0);else requestAnimFrame(this.__loop);
};

dispatcher.prototype.goFast = function () {
    if (this.interval) return;

    this.interval = true;
    this.begin();
};

dispatcher.prototype.goSlow = function () {
    if (!this.__interval) return;

    clearInterval(this.__interval);
    this.interval = false;

    this.begin();
};

dispatcher.prototype.stop = function () {
    this.running = false;
};

module.exports = dispatcher;

/***/ }),
/* 18 */
/***/ (function(module, exports) {



function renderer(world, container) {
    this.world = world;
    this.world.p2.on("addBody", e => {
        this.add_body(e.body);
    });

    this.world.p2.on("removeBody", e => {
        this.remove_body(e.body);
    });

    if (container) {
        this.elementContainer = container;
    } else {
        this.elementContainer = document.createElement("div");
        this.elementContainer.style.width = "100%";
        // this.elementContainer.style.height = "100%";
        document.body.appendChild(this.elementContainer);
    }

    this.pixelRatio = window.devicePixelRatio || 1;

    this.pixi = new PIXI.autoDetectRenderer(0, 0, {
        antialias: true,
        resolution: this.pixelRatio,
        transparent: true
    }, false);
    // this.pixi.backgroundColor = 0xFFFFFF;

    this.stage = new PIXI.Container();
    this.container = new PIXI.DisplayObjectContainer();

    this.stage.addChild(this.container);

    this.drawPoints = [];

    this.elementContainer.addEventListener("mousedown", function (e) {
        this.mousedown(this.mousePositionFromEvent(e));
    }.bind(this));

    this.elementContainer.addEventListener("mousemove", function (e) {
        if (e.which !== 1) return;

        this.mousemove(this.mousePositionFromEvent(e));
    }.bind(this));

    this.elementContainer.addEventListener("mouseup", function (e) {
        this.mouseup(this.mousePositionFromEvent(e));
    }.bind(this));

    this.pixi.view.style.width = "100%";
    this.pixi.view.style.height = "100%";
    this.pixi.view.style.border = "5px solid #EEE";
    this.elementContainer.appendChild(this.pixi.view);

    this.bodies = [];
    this.viewport = { scale: 35, center: [0, 0], width: 0, height: 0 };

    // resize the canvas to fill browser window dynamically
    window.addEventListener('resize', this.events.resize.bind(this), false);
    this.adjustBounds();

    this.drawingGraphic = new PIXI.Graphics();
    this.container.addChild(this.drawingGraphic);
};

renderer.prototype.events = {};
renderer.prototype.events.resize = function () {
    this.adjustBounds();
    this.pixi.render(this.stage);
};

renderer.prototype.mousePositionFromEvent = function (e) {
    var rect = this.pixi.view.getBoundingClientRect();
    var x = e.clientX - rect.left;
    var y = e.clientY - rect.top;
    return PIXI.interaction.InteractionData.prototype.getLocalPosition(this.stage, null, new PIXI.Point(x, y));
};

renderer.prototype.adjustBounds = function () {
    var outerW = this.elementContainer.offsetWidth;
    var outerH = outerW / 3 * 2;

    this.viewport.width = outerW;
    this.viewport.height = outerH;
    this.viewport.scale = outerW / 1200 * 35;

    this.offset = this.pixi.view.getBoundingClientRect();
    this.offset = {
        top: this.offset.top + document.body.scrollTop,
        left: this.offset.left + document.body.scrollLeft
    };

    this.pixi.resize(this.viewport.width, this.viewport.height);
};

renderer.prototype.render = function () {
    for (var i = 0; i < this.bodies.length; i++) {
        this.update_body(this.bodies[i]);
    }

    this.update_stage(this.stage);
    this.pixi.render(this.stage);
};

renderer.prototype.update_stage = function (stage) {
    stage.scale.x = this.viewport.scale;
    stage.scale.y = this.viewport.scale;
    stage.position.x = this.viewport.center[0] + this.viewport.width / 2;
    stage.position.y = this.viewport.center[1] + this.viewport.height / 2;
};

renderer.prototype.update_body = function (body) {
    body.gl_sprite.position.x = body.interpolatedPosition[0];
    body.gl_sprite.position.y = body.interpolatedPosition[1];
    body.gl_sprite.rotation = body.interpolatedAngle;
};

renderer.prototype.create_sprite = function (body) {

    var sprite = new PIXI.Graphics();

    this.draw_sprite(body, sprite);
    this.stage.addChild(sprite);

    if (body.gl_create) {
        body.gl_create(sprite, this);
    }

    return sprite;
};

renderer.prototype.draw_path = function (sprite, path, opt) {
    if (path.length < 2) return;

    if (typeof opt.line !== 'undefined') {
        sprite.lineStyle(opt.line.width, opt.line.color, opt.line.alpha);
    }

    if (typeof opt.fill !== 'undefined') {
        sprite.beginFill(opt.fill.color, opt.fill.alpha);
    }

    sprite.moveTo(path[0][0], path[0][1]);
    for (var i = 1; i < path.length; i++) {
        var p = path[i];
        sprite.lineTo(p[0], p[1]);
    }

    if (opt.fill !== 'undefined') {
        sprite.endFill();
    }
};

renderer.prototype.draw_rect = function (sprite, bounds, angle, opt) {
    var w = bounds.w,
        h = bounds.h,
        x = bounds.x,
        y = bounds.y;
    var path = [[w / 2, h / 2], [-w / 2, h / 2], [-w / 2, -h / 2], [w / 2, -h / 2], [w / 2, h / 2]];

    // Rotate and add position
    for (var i = 0; i < path.length; i++) {
        var v = path[i];
        p2.vec2.rotate(v, v, angle);
        p2.vec2.add(v, v, [x, y]);
    }

    this.draw_path(sprite, path, opt);
};

renderer.prototype.draw_sprite = function (body, sprite) {
    sprite.clear();

    var color = body.color;
    var opt = {
        line: { color: color, alpha: 1, width: 0.01 },
        fill: { color: color, alpha: 1.0 }
    };

    if (body.concavePath) {
        var path = [];

        for (var j = 0; j !== body.concavePath.length; j++) {
            var v = body.concavePath[j];
            path.push([v[0], v[1]]);
        }

        this.draw_path(sprite, path, opt);

        return;
    }

    for (var i = 0; i < body.shapes.length; i++) {
        var shape = body.shapes[i],
            offset = shape.position,
            angle = shape.angle;

        var shape_opt = opt;
        if (shape.color) {
            shape_opt = {
                line: { color: shape.color, alpha: 1, width: 0.01 },
                fill: { color: shape.color, alpha: 1.0 }
            };
        }

        if (shape instanceof p2.Box) {
            this.draw_rect(sprite, { w: shape.width, h: shape.height, x: offset[0], y: offset[1] }, angle, shape_opt);
        } else if (shape instanceof p2.Convex) {
            var path = [],
                v = p2.vec2.create();
            for (var j = 0; j < shape.vertices.length; j++) {
                p2.vec2.rotate(v, shape.vertices[j], angle);
                path.push([v[0] + offset[0], v[1] + offset[1]]);
            }

            this.draw_path(sprite, path, shape_opt);
        }
    }
};

renderer.prototype.add_body = function (body) {
    if (body instanceof p2.Body && body.shapes.length && !body.hidden) {
        body.gl_sprite = this.create_sprite(body);
        this.update_body(body);
        this.bodies.push(body);
    }
};

renderer.prototype.remove_body = function (body) {
    if (body.gl_sprite) {
        this.stage.removeChild(body.gl_sprite);

        for (var i = this.bodies.length; --i;) {
            if (this.bodies[i] === body) {
                this.bodies.splice(i, 1);
            }
        }
    }
};

renderer.prototype.zoom = function (factor) {
    this.viewport.scale *= factor;
};

var sampling = 0.4;
renderer.prototype.mousedown = function (pos) {
    this.drawPoints = [[pos.x, pos.y]];
};

renderer.prototype.mousemove = function (pos) {
    pos = [pos.x, pos.y];

    var sqdist = p2.vec2.distance(pos, this.drawPoints[this.drawPoints.length - 1]);
    if (sqdist > sampling * sampling) {
        this.drawPoints.push(pos);

        this.drawingGraphic.clear();
        this.draw_path(this.drawingGraphic, this.drawPoints, {
            line: {
                width: 0.02,
                color: 0xFF0000,
                alpha: 0.9
            }
        });
    }
};

renderer.prototype.mouseup = function (pos) {
    if (this.drawPoints.length > 2) {
        this.world.addBodyFromPoints(this.drawPoints);
    }

    this.drawPoints = [];
    this.drawingGraphic.clear();
};

module.exports = renderer;

/***/ }),
/* 19 */
/***/ (function(module, exports, __webpack_require__) {

var color = __webpack_require__(2);

function distanceSensor(car, opt) {
	this.car = car;
	this.angle = opt.angle / 180 * Math.PI;
	this.length = opt.length || 10;

	this.direction = [Math.sin(this.angle), Math.cos(this.angle)];
	this.start = opt.start || [0, 0.1];

	this.localNormal = p2.vec2.create();
	this.globalRay = p2.vec2.create();

	this.ray = new p2.Ray({
		mode: p2.Ray.CLOSEST,
		direction: this.direction,
		length: this.length,
		checkCollisionResponse: false,
		skipBackfaces: true
	});

	this.updateLength(this.length);

	this.castedResult = new p2.RaycastResult();
	this.hit = false;
	this.setDefault();

	this.data = new Float64Array(this.dimensions);
	this.highlighted = false;
}

distanceSensor.prototype.dimensions = 3;

distanceSensor.prototype.updateLength = function (v) {
	this.length = v;
	this.ray.length = this.length;
	this.end = [this.start[0] + this.direction[0] * this.length, this.start[1] + this.direction[1] * this.length];
	this.rayVector = [this.end[0] - this.start[0], this.end[1] - this.start[1]];
};

distanceSensor.prototype.setDefault = function () {
	this.distance = 1.0;
	this.entity = 0;
	this.localNormal[0] = 0;
	this.localNormal[1] = 0;
	this.reflectionAngle = 0;
};

distanceSensor.prototype.update = function () {
	var vehicleBody = this.car.chassisBody;
	if (vehicleBody.world === null) return;

	vehicleBody.toWorldFrame(this.ray.from, this.start);
	vehicleBody.toWorldFrame(this.ray.to, this.end);

	this.ray.update();
	this.castedResult.reset();

	vehicleBody.world.raycast(this.castedResult, this.ray);

	if (this.hit = this.castedResult.hasHit()) {
		this.distance = this.castedResult.fraction;
		this.entity = this.castedResult.shape.entity;

		vehicleBody.vectorToLocalFrame(this.localNormal, this.castedResult.normal);
		vehicleBody.vectorToWorldFrame(this.globalRay, this.rayVector);

		this.reflectionAngle = Math.atan2(this.castedResult.normal[1], this.castedResult.normal[0]) - Math.atan2(this.globalRay[1], this.globalRay[0]); // = Math.atan2( this.localNormal[1], this.localNormal[0] ) - Math.atan2( this.rayVector[1], this.rayVector[0] )	
		if (this.reflectionAngle > Math.PI / 2) this.reflectionAngle = Math.PI - this.reflectionAngle;
		if (this.reflectionAngle < -Math.PI / 2) this.reflectionAngle = Math.PI + this.reflectionAngle;
	} else {
		this.setDefault();
	}
};

distanceSensor.prototype.draw = function (g) {
	var dist = this.distance;
	var c = color.rgbToHex(Math.floor((1 - this.distance) * 255), Math.floor(this.distance * 128), 128);
	g.lineStyle(this.highlighted ? 0.04 : 0.01, c, 0.5);
	g.moveTo(this.start[0], this.start[1]);
	g.lineTo(this.start[0] + this.direction[0] * this.length * dist, this.start[1] + this.direction[1] * this.length * dist);
};

distanceSensor.prototype.read = function () {
	if (this.hit) {
		this.data[0] = 1.0 - this.distance;
		this.data[1] = this.reflectionAngle;
		this.data[2] = this.entity === 2 ? 1.0 : 0.0; // is car?
	} else {
		this.data.fill(0.0);
	}

	return this.data;
};

function speedSensor(car, opt) {
	this.car = car;
	this.local = p2.vec2.create();
	this.data = new Float64Array(this.dimensions);
}

speedSensor.prototype.dimensions = 1;

speedSensor.prototype.update = function () {
	this.car.chassisBody.vectorToLocalFrame(this.local, this.car.chassisBody.velocity);
	this.velocity = p2.vec2.len(this.car.chassisBody.velocity) * (this.local[1] > 0 ? 1.0 : -1.0);
};

speedSensor.prototype.draw = function (g) {
	if (g.__label === undefined) {
		g.__label = new PIXI.Text('0 km/h', { font: '80px Helvetica Neue' });
		g.__label.scale.x = g.__label.scale.y = 3e-3;
		g.addChild(g.__label);
	}

	g.__label.text = Math.floor(this.velocity * 3.6) + ' km/h';
	g.__label.rotation = -this.car.chassisBody.interpolatedAngle;
};

speedSensor.prototype.read = function () {
	this.data[0] = this.velocity;

	return this.data;
};

function create(car, opt) {
	switch (opt.type) {
		case 'distance':
			return new distanceSensor(car, opt);

		case 'speed':
			return new speedSensor(car, opt);

		default:
			return null;
	}
}

function build(car, config) {
	var out = [];

	if (car.dynamicForwardSensor) {
		config = config.splice(0, 0, { type: 'distance', angle: +0, length: 0 });
	}

	for (var i = 0; i < config.length; i++) {
		var sensor = create(car, config[i]);
		if (sensor !== null) {
			out.push(sensor);
		}
	}

	return out;
}

module.exports = {
	distance: distanceSensor,
	speed: speedSensor,
	build: build
};

/***/ }),
/* 20 */
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_RESULT__;// TinyColor v1.4.1
// https://github.com/bgrins/TinyColor
// Brian Grinstead, MIT License

(function (Math) {

    var trimLeft = /^\s+/,
        trimRight = /\s+$/,
        tinyCounter = 0,
        mathRound = Math.round,
        mathMin = Math.min,
        mathMax = Math.max,
        mathRandom = Math.random;

    function tinycolor(color, opts) {

        color = color ? color : '';
        opts = opts || {};

        // If input is already a tinycolor, return itself
        if (color instanceof tinycolor) {
            return color;
        }
        // If we are called as a function, call using new instead
        if (!(this instanceof tinycolor)) {
            return new tinycolor(color, opts);
        }

        var rgb = inputToRGB(color);
        this._originalInput = color, this._r = rgb.r, this._g = rgb.g, this._b = rgb.b, this._a = rgb.a, this._roundA = mathRound(100 * this._a) / 100, this._format = opts.format || rgb.format;
        this._gradientType = opts.gradientType;

        // Don't let the range of [0,255] come back in [0,1].
        // Potentially lose a little bit of precision here, but will fix issues where
        // .5 gets interpreted as half of the total, instead of half of 1
        // If it was supposed to be 128, this was already taken care of by `inputToRgb`
        if (this._r < 1) {
            this._r = mathRound(this._r);
        }
        if (this._g < 1) {
            this._g = mathRound(this._g);
        }
        if (this._b < 1) {
            this._b = mathRound(this._b);
        }

        this._ok = rgb.ok;
        this._tc_id = tinyCounter++;
    }

    tinycolor.prototype = {
        isDark: function () {
            return this.getBrightness() < 128;
        },
        isLight: function () {
            return !this.isDark();
        },
        isValid: function () {
            return this._ok;
        },
        getOriginalInput: function () {
            return this._originalInput;
        },
        getFormat: function () {
            return this._format;
        },
        getAlpha: function () {
            return this._a;
        },
        getBrightness: function () {
            //http://www.w3.org/TR/AERT#color-contrast
            var rgb = this.toRgb();
            return (rgb.r * 299 + rgb.g * 587 + rgb.b * 114) / 1000;
        },
        getLuminance: function () {
            //http://www.w3.org/TR/2008/REC-WCAG20-20081211/#relativeluminancedef
            var rgb = this.toRgb();
            var RsRGB, GsRGB, BsRGB, R, G, B;
            RsRGB = rgb.r / 255;
            GsRGB = rgb.g / 255;
            BsRGB = rgb.b / 255;

            if (RsRGB <= 0.03928) {
                R = RsRGB / 12.92;
            } else {
                R = Math.pow((RsRGB + 0.055) / 1.055, 2.4);
            }
            if (GsRGB <= 0.03928) {
                G = GsRGB / 12.92;
            } else {
                G = Math.pow((GsRGB + 0.055) / 1.055, 2.4);
            }
            if (BsRGB <= 0.03928) {
                B = BsRGB / 12.92;
            } else {
                B = Math.pow((BsRGB + 0.055) / 1.055, 2.4);
            }
            return 0.2126 * R + 0.7152 * G + 0.0722 * B;
        },
        setAlpha: function (value) {
            this._a = boundAlpha(value);
            this._roundA = mathRound(100 * this._a) / 100;
            return this;
        },
        toHsv: function () {
            var hsv = rgbToHsv(this._r, this._g, this._b);
            return { h: hsv.h * 360, s: hsv.s, v: hsv.v, a: this._a };
        },
        toHsvString: function () {
            var hsv = rgbToHsv(this._r, this._g, this._b);
            var h = mathRound(hsv.h * 360),
                s = mathRound(hsv.s * 100),
                v = mathRound(hsv.v * 100);
            return this._a == 1 ? "hsv(" + h + ", " + s + "%, " + v + "%)" : "hsva(" + h + ", " + s + "%, " + v + "%, " + this._roundA + ")";
        },
        toHsl: function () {
            var hsl = rgbToHsl(this._r, this._g, this._b);
            return { h: hsl.h * 360, s: hsl.s, l: hsl.l, a: this._a };
        },
        toHslString: function () {
            var hsl = rgbToHsl(this._r, this._g, this._b);
            var h = mathRound(hsl.h * 360),
                s = mathRound(hsl.s * 100),
                l = mathRound(hsl.l * 100);
            return this._a == 1 ? "hsl(" + h + ", " + s + "%, " + l + "%)" : "hsla(" + h + ", " + s + "%, " + l + "%, " + this._roundA + ")";
        },
        toHex: function (allow3Char) {
            return rgbToHex(this._r, this._g, this._b, allow3Char);
        },
        toHexString: function (allow3Char) {
            return '#' + this.toHex(allow3Char);
        },
        toHex8: function (allow4Char) {
            return rgbaToHex(this._r, this._g, this._b, this._a, allow4Char);
        },
        toHex8String: function (allow4Char) {
            return '#' + this.toHex8(allow4Char);
        },
        toRgb: function () {
            return { r: mathRound(this._r), g: mathRound(this._g), b: mathRound(this._b), a: this._a };
        },
        toRgbString: function () {
            return this._a == 1 ? "rgb(" + mathRound(this._r) + ", " + mathRound(this._g) + ", " + mathRound(this._b) + ")" : "rgba(" + mathRound(this._r) + ", " + mathRound(this._g) + ", " + mathRound(this._b) + ", " + this._roundA + ")";
        },
        toPercentageRgb: function () {
            return { r: mathRound(bound01(this._r, 255) * 100) + "%", g: mathRound(bound01(this._g, 255) * 100) + "%", b: mathRound(bound01(this._b, 255) * 100) + "%", a: this._a };
        },
        toPercentageRgbString: function () {
            return this._a == 1 ? "rgb(" + mathRound(bound01(this._r, 255) * 100) + "%, " + mathRound(bound01(this._g, 255) * 100) + "%, " + mathRound(bound01(this._b, 255) * 100) + "%)" : "rgba(" + mathRound(bound01(this._r, 255) * 100) + "%, " + mathRound(bound01(this._g, 255) * 100) + "%, " + mathRound(bound01(this._b, 255) * 100) + "%, " + this._roundA + ")";
        },
        toName: function () {
            if (this._a === 0) {
                return "transparent";
            }

            if (this._a < 1) {
                return false;
            }

            return hexNames[rgbToHex(this._r, this._g, this._b, true)] || false;
        },
        toFilter: function (secondColor) {
            var hex8String = '#' + rgbaToArgbHex(this._r, this._g, this._b, this._a);
            var secondHex8String = hex8String;
            var gradientType = this._gradientType ? "GradientType = 1, " : "";

            if (secondColor) {
                var s = tinycolor(secondColor);
                secondHex8String = '#' + rgbaToArgbHex(s._r, s._g, s._b, s._a);
            }

            return "progid:DXImageTransform.Microsoft.gradient(" + gradientType + "startColorstr=" + hex8String + ",endColorstr=" + secondHex8String + ")";
        },
        toString: function (format) {
            var formatSet = !!format;
            format = format || this._format;

            var formattedString = false;
            var hasAlpha = this._a < 1 && this._a >= 0;
            var needsAlphaFormat = !formatSet && hasAlpha && (format === "hex" || format === "hex6" || format === "hex3" || format === "hex4" || format === "hex8" || format === "name");

            if (needsAlphaFormat) {
                // Special case for "transparent", all other non-alpha formats
                // will return rgba when there is transparency.
                if (format === "name" && this._a === 0) {
                    return this.toName();
                }
                return this.toRgbString();
            }
            if (format === "rgb") {
                formattedString = this.toRgbString();
            }
            if (format === "prgb") {
                formattedString = this.toPercentageRgbString();
            }
            if (format === "hex" || format === "hex6") {
                formattedString = this.toHexString();
            }
            if (format === "hex3") {
                formattedString = this.toHexString(true);
            }
            if (format === "hex4") {
                formattedString = this.toHex8String(true);
            }
            if (format === "hex8") {
                formattedString = this.toHex8String();
            }
            if (format === "name") {
                formattedString = this.toName();
            }
            if (format === "hsl") {
                formattedString = this.toHslString();
            }
            if (format === "hsv") {
                formattedString = this.toHsvString();
            }

            return formattedString || this.toHexString();
        },
        clone: function () {
            return tinycolor(this.toString());
        },

        _applyModification: function (fn, args) {
            var color = fn.apply(null, [this].concat([].slice.call(args)));
            this._r = color._r;
            this._g = color._g;
            this._b = color._b;
            this.setAlpha(color._a);
            return this;
        },
        lighten: function () {
            return this._applyModification(lighten, arguments);
        },
        brighten: function () {
            return this._applyModification(brighten, arguments);
        },
        darken: function () {
            return this._applyModification(darken, arguments);
        },
        desaturate: function () {
            return this._applyModification(desaturate, arguments);
        },
        saturate: function () {
            return this._applyModification(saturate, arguments);
        },
        greyscale: function () {
            return this._applyModification(greyscale, arguments);
        },
        spin: function () {
            return this._applyModification(spin, arguments);
        },

        _applyCombination: function (fn, args) {
            return fn.apply(null, [this].concat([].slice.call(args)));
        },
        analogous: function () {
            return this._applyCombination(analogous, arguments);
        },
        complement: function () {
            return this._applyCombination(complement, arguments);
        },
        monochromatic: function () {
            return this._applyCombination(monochromatic, arguments);
        },
        splitcomplement: function () {
            return this._applyCombination(splitcomplement, arguments);
        },
        triad: function () {
            return this._applyCombination(triad, arguments);
        },
        tetrad: function () {
            return this._applyCombination(tetrad, arguments);
        }
    };

    // If input is an object, force 1 into "1.0" to handle ratios properly
    // String input requires "1.0" as input, so 1 will be treated as 1
    tinycolor.fromRatio = function (color, opts) {
        if (typeof color == "object") {
            var newColor = {};
            for (var i in color) {
                if (color.hasOwnProperty(i)) {
                    if (i === "a") {
                        newColor[i] = color[i];
                    } else {
                        newColor[i] = convertToPercentage(color[i]);
                    }
                }
            }
            color = newColor;
        }

        return tinycolor(color, opts);
    };

    // Given a string or object, convert that input to RGB
    // Possible string inputs:
    //
    //     "red"
    //     "#f00" or "f00"
    //     "#ff0000" or "ff0000"
    //     "#ff000000" or "ff000000"
    //     "rgb 255 0 0" or "rgb (255, 0, 0)"
    //     "rgb 1.0 0 0" or "rgb (1, 0, 0)"
    //     "rgba (255, 0, 0, 1)" or "rgba 255, 0, 0, 1"
    //     "rgba (1.0, 0, 0, 1)" or "rgba 1.0, 0, 0, 1"
    //     "hsl(0, 100%, 50%)" or "hsl 0 100% 50%"
    //     "hsla(0, 100%, 50%, 1)" or "hsla 0 100% 50%, 1"
    //     "hsv(0, 100%, 100%)" or "hsv 0 100% 100%"
    //
    function inputToRGB(color) {

        var rgb = { r: 0, g: 0, b: 0 };
        var a = 1;
        var s = null;
        var v = null;
        var l = null;
        var ok = false;
        var format = false;

        if (typeof color == "string") {
            color = stringInputToObject(color);
        }

        if (typeof color == "object") {
            if (isValidCSSUnit(color.r) && isValidCSSUnit(color.g) && isValidCSSUnit(color.b)) {
                rgb = rgbToRgb(color.r, color.g, color.b);
                ok = true;
                format = String(color.r).substr(-1) === "%" ? "prgb" : "rgb";
            } else if (isValidCSSUnit(color.h) && isValidCSSUnit(color.s) && isValidCSSUnit(color.v)) {
                s = convertToPercentage(color.s);
                v = convertToPercentage(color.v);
                rgb = hsvToRgb(color.h, s, v);
                ok = true;
                format = "hsv";
            } else if (isValidCSSUnit(color.h) && isValidCSSUnit(color.s) && isValidCSSUnit(color.l)) {
                s = convertToPercentage(color.s);
                l = convertToPercentage(color.l);
                rgb = hslToRgb(color.h, s, l);
                ok = true;
                format = "hsl";
            }

            if (color.hasOwnProperty("a")) {
                a = color.a;
            }
        }

        a = boundAlpha(a);

        return {
            ok: ok,
            format: color.format || format,
            r: mathMin(255, mathMax(rgb.r, 0)),
            g: mathMin(255, mathMax(rgb.g, 0)),
            b: mathMin(255, mathMax(rgb.b, 0)),
            a: a
        };
    }

    // Conversion Functions
    // --------------------

    // `rgbToHsl`, `rgbToHsv`, `hslToRgb`, `hsvToRgb` modified from:
    // <http://mjijackson.com/2008/02/rgb-to-hsl-and-rgb-to-hsv-color-model-conversion-algorithms-in-javascript>

    // `rgbToRgb`
    // Handle bounds / percentage checking to conform to CSS color spec
    // <http://www.w3.org/TR/css3-color/>
    // *Assumes:* r, g, b in [0, 255] or [0, 1]
    // *Returns:* { r, g, b } in [0, 255]
    function rgbToRgb(r, g, b) {
        return {
            r: bound01(r, 255) * 255,
            g: bound01(g, 255) * 255,
            b: bound01(b, 255) * 255
        };
    }

    // `rgbToHsl`
    // Converts an RGB color value to HSL.
    // *Assumes:* r, g, and b are contained in [0, 255] or [0, 1]
    // *Returns:* { h, s, l } in [0,1]
    function rgbToHsl(r, g, b) {

        r = bound01(r, 255);
        g = bound01(g, 255);
        b = bound01(b, 255);

        var max = mathMax(r, g, b),
            min = mathMin(r, g, b);
        var h,
            s,
            l = (max + min) / 2;

        if (max == min) {
            h = s = 0; // achromatic
        } else {
            var d = max - min;
            s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
            switch (max) {
                case r:
                    h = (g - b) / d + (g < b ? 6 : 0);break;
                case g:
                    h = (b - r) / d + 2;break;
                case b:
                    h = (r - g) / d + 4;break;
            }

            h /= 6;
        }

        return { h: h, s: s, l: l };
    }

    // `hslToRgb`
    // Converts an HSL color value to RGB.
    // *Assumes:* h is contained in [0, 1] or [0, 360] and s and l are contained [0, 1] or [0, 100]
    // *Returns:* { r, g, b } in the set [0, 255]
    function hslToRgb(h, s, l) {
        var r, g, b;

        h = bound01(h, 360);
        s = bound01(s, 100);
        l = bound01(l, 100);

        function hue2rgb(p, q, t) {
            if (t < 0) t += 1;
            if (t > 1) t -= 1;
            if (t < 1 / 6) return p + (q - p) * 6 * t;
            if (t < 1 / 2) return q;
            if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
            return p;
        }

        if (s === 0) {
            r = g = b = l; // achromatic
        } else {
            var q = l < 0.5 ? l * (1 + s) : l + s - l * s;
            var p = 2 * l - q;
            r = hue2rgb(p, q, h + 1 / 3);
            g = hue2rgb(p, q, h);
            b = hue2rgb(p, q, h - 1 / 3);
        }

        return { r: r * 255, g: g * 255, b: b * 255 };
    }

    // `rgbToHsv`
    // Converts an RGB color value to HSV
    // *Assumes:* r, g, and b are contained in the set [0, 255] or [0, 1]
    // *Returns:* { h, s, v } in [0,1]
    function rgbToHsv(r, g, b) {

        r = bound01(r, 255);
        g = bound01(g, 255);
        b = bound01(b, 255);

        var max = mathMax(r, g, b),
            min = mathMin(r, g, b);
        var h,
            s,
            v = max;

        var d = max - min;
        s = max === 0 ? 0 : d / max;

        if (max == min) {
            h = 0; // achromatic
        } else {
            switch (max) {
                case r:
                    h = (g - b) / d + (g < b ? 6 : 0);break;
                case g:
                    h = (b - r) / d + 2;break;
                case b:
                    h = (r - g) / d + 4;break;
            }
            h /= 6;
        }
        return { h: h, s: s, v: v };
    }

    // `hsvToRgb`
    // Converts an HSV color value to RGB.
    // *Assumes:* h is contained in [0, 1] or [0, 360] and s and v are contained in [0, 1] or [0, 100]
    // *Returns:* { r, g, b } in the set [0, 255]
    function hsvToRgb(h, s, v) {

        h = bound01(h, 360) * 6;
        s = bound01(s, 100);
        v = bound01(v, 100);

        var i = Math.floor(h),
            f = h - i,
            p = v * (1 - s),
            q = v * (1 - f * s),
            t = v * (1 - (1 - f) * s),
            mod = i % 6,
            r = [v, q, p, p, t, v][mod],
            g = [t, v, v, q, p, p][mod],
            b = [p, p, t, v, v, q][mod];

        return { r: r * 255, g: g * 255, b: b * 255 };
    }

    // `rgbToHex`
    // Converts an RGB color to hex
    // Assumes r, g, and b are contained in the set [0, 255]
    // Returns a 3 or 6 character hex
    function rgbToHex(r, g, b, allow3Char) {

        var hex = [pad2(mathRound(r).toString(16)), pad2(mathRound(g).toString(16)), pad2(mathRound(b).toString(16))];

        // Return a 3 character hex if possible
        if (allow3Char && hex[0].charAt(0) == hex[0].charAt(1) && hex[1].charAt(0) == hex[1].charAt(1) && hex[2].charAt(0) == hex[2].charAt(1)) {
            return hex[0].charAt(0) + hex[1].charAt(0) + hex[2].charAt(0);
        }

        return hex.join("");
    }

    // `rgbaToHex`
    // Converts an RGBA color plus alpha transparency to hex
    // Assumes r, g, b are contained in the set [0, 255] and
    // a in [0, 1]. Returns a 4 or 8 character rgba hex
    function rgbaToHex(r, g, b, a, allow4Char) {

        var hex = [pad2(mathRound(r).toString(16)), pad2(mathRound(g).toString(16)), pad2(mathRound(b).toString(16)), pad2(convertDecimalToHex(a))];

        // Return a 4 character hex if possible
        if (allow4Char && hex[0].charAt(0) == hex[0].charAt(1) && hex[1].charAt(0) == hex[1].charAt(1) && hex[2].charAt(0) == hex[2].charAt(1) && hex[3].charAt(0) == hex[3].charAt(1)) {
            return hex[0].charAt(0) + hex[1].charAt(0) + hex[2].charAt(0) + hex[3].charAt(0);
        }

        return hex.join("");
    }

    // `rgbaToArgbHex`
    // Converts an RGBA color to an ARGB Hex8 string
    // Rarely used, but required for "toFilter()"
    function rgbaToArgbHex(r, g, b, a) {

        var hex = [pad2(convertDecimalToHex(a)), pad2(mathRound(r).toString(16)), pad2(mathRound(g).toString(16)), pad2(mathRound(b).toString(16))];

        return hex.join("");
    }

    // `equals`
    // Can be called with any tinycolor input
    tinycolor.equals = function (color1, color2) {
        if (!color1 || !color2) {
            return false;
        }
        return tinycolor(color1).toRgbString() == tinycolor(color2).toRgbString();
    };

    tinycolor.random = function () {
        return tinycolor.fromRatio({
            r: mathRandom(),
            g: mathRandom(),
            b: mathRandom()
        });
    };

    // Modification Functions
    // ----------------------
    // Thanks to less.js for some of the basics here
    // <https://github.com/cloudhead/less.js/blob/master/lib/less/functions.js>

    function desaturate(color, amount) {
        amount = amount === 0 ? 0 : amount || 10;
        var hsl = tinycolor(color).toHsl();
        hsl.s -= amount / 100;
        hsl.s = clamp01(hsl.s);
        return tinycolor(hsl);
    }

    function saturate(color, amount) {
        amount = amount === 0 ? 0 : amount || 10;
        var hsl = tinycolor(color).toHsl();
        hsl.s += amount / 100;
        hsl.s = clamp01(hsl.s);
        return tinycolor(hsl);
    }

    function greyscale(color) {
        return tinycolor(color).desaturate(100);
    }

    function lighten(color, amount) {
        amount = amount === 0 ? 0 : amount || 10;
        var hsl = tinycolor(color).toHsl();
        hsl.l += amount / 100;
        hsl.l = clamp01(hsl.l);
        return tinycolor(hsl);
    }

    function brighten(color, amount) {
        amount = amount === 0 ? 0 : amount || 10;
        var rgb = tinycolor(color).toRgb();
        rgb.r = mathMax(0, mathMin(255, rgb.r - mathRound(255 * -(amount / 100))));
        rgb.g = mathMax(0, mathMin(255, rgb.g - mathRound(255 * -(amount / 100))));
        rgb.b = mathMax(0, mathMin(255, rgb.b - mathRound(255 * -(amount / 100))));
        return tinycolor(rgb);
    }

    function darken(color, amount) {
        amount = amount === 0 ? 0 : amount || 10;
        var hsl = tinycolor(color).toHsl();
        hsl.l -= amount / 100;
        hsl.l = clamp01(hsl.l);
        return tinycolor(hsl);
    }

    // Spin takes a positive or negative amount within [-360, 360] indicating the change of hue.
    // Values outside of this range will be wrapped into this range.
    function spin(color, amount) {
        var hsl = tinycolor(color).toHsl();
        var hue = (hsl.h + amount) % 360;
        hsl.h = hue < 0 ? 360 + hue : hue;
        return tinycolor(hsl);
    }

    // Combination Functions
    // ---------------------
    // Thanks to jQuery xColor for some of the ideas behind these
    // <https://github.com/infusion/jQuery-xcolor/blob/master/jquery.xcolor.js>

    function complement(color) {
        var hsl = tinycolor(color).toHsl();
        hsl.h = (hsl.h + 180) % 360;
        return tinycolor(hsl);
    }

    function triad(color) {
        var hsl = tinycolor(color).toHsl();
        var h = hsl.h;
        return [tinycolor(color), tinycolor({ h: (h + 120) % 360, s: hsl.s, l: hsl.l }), tinycolor({ h: (h + 240) % 360, s: hsl.s, l: hsl.l })];
    }

    function tetrad(color) {
        var hsl = tinycolor(color).toHsl();
        var h = hsl.h;
        return [tinycolor(color), tinycolor({ h: (h + 90) % 360, s: hsl.s, l: hsl.l }), tinycolor({ h: (h + 180) % 360, s: hsl.s, l: hsl.l }), tinycolor({ h: (h + 270) % 360, s: hsl.s, l: hsl.l })];
    }

    function splitcomplement(color) {
        var hsl = tinycolor(color).toHsl();
        var h = hsl.h;
        return [tinycolor(color), tinycolor({ h: (h + 72) % 360, s: hsl.s, l: hsl.l }), tinycolor({ h: (h + 216) % 360, s: hsl.s, l: hsl.l })];
    }

    function analogous(color, results, slices) {
        results = results || 6;
        slices = slices || 30;

        var hsl = tinycolor(color).toHsl();
        var part = 360 / slices;
        var ret = [tinycolor(color)];

        for (hsl.h = (hsl.h - (part * results >> 1) + 720) % 360; --results;) {
            hsl.h = (hsl.h + part) % 360;
            ret.push(tinycolor(hsl));
        }
        return ret;
    }

    function monochromatic(color, results) {
        results = results || 6;
        var hsv = tinycolor(color).toHsv();
        var h = hsv.h,
            s = hsv.s,
            v = hsv.v;
        var ret = [];
        var modification = 1 / results;

        while (results--) {
            ret.push(tinycolor({ h: h, s: s, v: v }));
            v = (v + modification) % 1;
        }

        return ret;
    }

    // Utility Functions
    // ---------------------

    tinycolor.mix = function (color1, color2, amount) {
        amount = amount === 0 ? 0 : amount || 50;

        var rgb1 = tinycolor(color1).toRgb();
        var rgb2 = tinycolor(color2).toRgb();

        var p = amount / 100;

        var rgba = {
            r: (rgb2.r - rgb1.r) * p + rgb1.r,
            g: (rgb2.g - rgb1.g) * p + rgb1.g,
            b: (rgb2.b - rgb1.b) * p + rgb1.b,
            a: (rgb2.a - rgb1.a) * p + rgb1.a
        };

        return tinycolor(rgba);
    };

    // Readability Functions
    // ---------------------
    // <http://www.w3.org/TR/2008/REC-WCAG20-20081211/#contrast-ratiodef (WCAG Version 2)

    // `contrast`
    // Analyze the 2 colors and returns the color contrast defined by (WCAG Version 2)
    tinycolor.readability = function (color1, color2) {
        var c1 = tinycolor(color1);
        var c2 = tinycolor(color2);
        return (Math.max(c1.getLuminance(), c2.getLuminance()) + 0.05) / (Math.min(c1.getLuminance(), c2.getLuminance()) + 0.05);
    };

    // `isReadable`
    // Ensure that foreground and background color combinations meet WCAG2 guidelines.
    // The third argument is an optional Object.
    //      the 'level' property states 'AA' or 'AAA' - if missing or invalid, it defaults to 'AA';
    //      the 'size' property states 'large' or 'small' - if missing or invalid, it defaults to 'small'.
    // If the entire object is absent, isReadable defaults to {level:"AA",size:"small"}.

    // *Example*
    //    tinycolor.isReadable("#000", "#111") => false
    //    tinycolor.isReadable("#000", "#111",{level:"AA",size:"large"}) => false
    tinycolor.isReadable = function (color1, color2, wcag2) {
        var readability = tinycolor.readability(color1, color2);
        var wcag2Parms, out;

        out = false;

        wcag2Parms = validateWCAG2Parms(wcag2);
        switch (wcag2Parms.level + wcag2Parms.size) {
            case "AAsmall":
            case "AAAlarge":
                out = readability >= 4.5;
                break;
            case "AAlarge":
                out = readability >= 3;
                break;
            case "AAAsmall":
                out = readability >= 7;
                break;
        }
        return out;
    };

    // `mostReadable`
    // Given a base color and a list of possible foreground or background
    // colors for that base, returns the most readable color.
    // Optionally returns Black or White if the most readable color is unreadable.
    // *Example*
    //    tinycolor.mostReadable(tinycolor.mostReadable("#123", ["#124", "#125"],{includeFallbackColors:false}).toHexString(); // "#112255"
    //    tinycolor.mostReadable(tinycolor.mostReadable("#123", ["#124", "#125"],{includeFallbackColors:true}).toHexString();  // "#ffffff"
    //    tinycolor.mostReadable("#a8015a", ["#faf3f3"],{includeFallbackColors:true,level:"AAA",size:"large"}).toHexString(); // "#faf3f3"
    //    tinycolor.mostReadable("#a8015a", ["#faf3f3"],{includeFallbackColors:true,level:"AAA",size:"small"}).toHexString(); // "#ffffff"
    tinycolor.mostReadable = function (baseColor, colorList, args) {
        var bestColor = null;
        var bestScore = 0;
        var readability;
        var includeFallbackColors, level, size;
        args = args || {};
        includeFallbackColors = args.includeFallbackColors;
        level = args.level;
        size = args.size;

        for (var i = 0; i < colorList.length; i++) {
            readability = tinycolor.readability(baseColor, colorList[i]);
            if (readability > bestScore) {
                bestScore = readability;
                bestColor = tinycolor(colorList[i]);
            }
        }

        if (tinycolor.isReadable(baseColor, bestColor, { "level": level, "size": size }) || !includeFallbackColors) {
            return bestColor;
        } else {
            args.includeFallbackColors = false;
            return tinycolor.mostReadable(baseColor, ["#fff", "#000"], args);
        }
    };

    // Big List of Colors
    // ------------------
    // <http://www.w3.org/TR/css3-color/#svg-color>
    var names = tinycolor.names = {
        aliceblue: "f0f8ff",
        antiquewhite: "faebd7",
        aqua: "0ff",
        aquamarine: "7fffd4",
        azure: "f0ffff",
        beige: "f5f5dc",
        bisque: "ffe4c4",
        black: "000",
        blanchedalmond: "ffebcd",
        blue: "00f",
        blueviolet: "8a2be2",
        brown: "a52a2a",
        burlywood: "deb887",
        burntsienna: "ea7e5d",
        cadetblue: "5f9ea0",
        chartreuse: "7fff00",
        chocolate: "d2691e",
        coral: "ff7f50",
        cornflowerblue: "6495ed",
        cornsilk: "fff8dc",
        crimson: "dc143c",
        cyan: "0ff",
        darkblue: "00008b",
        darkcyan: "008b8b",
        darkgoldenrod: "b8860b",
        darkgray: "a9a9a9",
        darkgreen: "006400",
        darkgrey: "a9a9a9",
        darkkhaki: "bdb76b",
        darkmagenta: "8b008b",
        darkolivegreen: "556b2f",
        darkorange: "ff8c00",
        darkorchid: "9932cc",
        darkred: "8b0000",
        darksalmon: "e9967a",
        darkseagreen: "8fbc8f",
        darkslateblue: "483d8b",
        darkslategray: "2f4f4f",
        darkslategrey: "2f4f4f",
        darkturquoise: "00ced1",
        darkviolet: "9400d3",
        deeppink: "ff1493",
        deepskyblue: "00bfff",
        dimgray: "696969",
        dimgrey: "696969",
        dodgerblue: "1e90ff",
        firebrick: "b22222",
        floralwhite: "fffaf0",
        forestgreen: "228b22",
        fuchsia: "f0f",
        gainsboro: "dcdcdc",
        ghostwhite: "f8f8ff",
        gold: "ffd700",
        goldenrod: "daa520",
        gray: "808080",
        green: "008000",
        greenyellow: "adff2f",
        grey: "808080",
        honeydew: "f0fff0",
        hotpink: "ff69b4",
        indianred: "cd5c5c",
        indigo: "4b0082",
        ivory: "fffff0",
        khaki: "f0e68c",
        lavender: "e6e6fa",
        lavenderblush: "fff0f5",
        lawngreen: "7cfc00",
        lemonchiffon: "fffacd",
        lightblue: "add8e6",
        lightcoral: "f08080",
        lightcyan: "e0ffff",
        lightgoldenrodyellow: "fafad2",
        lightgray: "d3d3d3",
        lightgreen: "90ee90",
        lightgrey: "d3d3d3",
        lightpink: "ffb6c1",
        lightsalmon: "ffa07a",
        lightseagreen: "20b2aa",
        lightskyblue: "87cefa",
        lightslategray: "789",
        lightslategrey: "789",
        lightsteelblue: "b0c4de",
        lightyellow: "ffffe0",
        lime: "0f0",
        limegreen: "32cd32",
        linen: "faf0e6",
        magenta: "f0f",
        maroon: "800000",
        mediumaquamarine: "66cdaa",
        mediumblue: "0000cd",
        mediumorchid: "ba55d3",
        mediumpurple: "9370db",
        mediumseagreen: "3cb371",
        mediumslateblue: "7b68ee",
        mediumspringgreen: "00fa9a",
        mediumturquoise: "48d1cc",
        mediumvioletred: "c71585",
        midnightblue: "191970",
        mintcream: "f5fffa",
        mistyrose: "ffe4e1",
        moccasin: "ffe4b5",
        navajowhite: "ffdead",
        navy: "000080",
        oldlace: "fdf5e6",
        olive: "808000",
        olivedrab: "6b8e23",
        orange: "ffa500",
        orangered: "ff4500",
        orchid: "da70d6",
        palegoldenrod: "eee8aa",
        palegreen: "98fb98",
        paleturquoise: "afeeee",
        palevioletred: "db7093",
        papayawhip: "ffefd5",
        peachpuff: "ffdab9",
        peru: "cd853f",
        pink: "ffc0cb",
        plum: "dda0dd",
        powderblue: "b0e0e6",
        purple: "800080",
        rebeccapurple: "663399",
        red: "f00",
        rosybrown: "bc8f8f",
        royalblue: "4169e1",
        saddlebrown: "8b4513",
        salmon: "fa8072",
        sandybrown: "f4a460",
        seagreen: "2e8b57",
        seashell: "fff5ee",
        sienna: "a0522d",
        silver: "c0c0c0",
        skyblue: "87ceeb",
        slateblue: "6a5acd",
        slategray: "708090",
        slategrey: "708090",
        snow: "fffafa",
        springgreen: "00ff7f",
        steelblue: "4682b4",
        tan: "d2b48c",
        teal: "008080",
        thistle: "d8bfd8",
        tomato: "ff6347",
        turquoise: "40e0d0",
        violet: "ee82ee",
        wheat: "f5deb3",
        white: "fff",
        whitesmoke: "f5f5f5",
        yellow: "ff0",
        yellowgreen: "9acd32"
    };

    // Make it easy to access colors via `hexNames[hex]`
    var hexNames = tinycolor.hexNames = flip(names);

    // Utilities
    // ---------

    // `{ 'name1': 'val1' }` becomes `{ 'val1': 'name1' }`
    function flip(o) {
        var flipped = {};
        for (var i in o) {
            if (o.hasOwnProperty(i)) {
                flipped[o[i]] = i;
            }
        }
        return flipped;
    }

    // Return a valid alpha value [0,1] with all invalid values being set to 1
    function boundAlpha(a) {
        a = parseFloat(a);

        if (isNaN(a) || a < 0 || a > 1) {
            a = 1;
        }

        return a;
    }

    // Take input from [0, n] and return it as [0, 1]
    function bound01(n, max) {
        if (isOnePointZero(n)) {
            n = "100%";
        }

        var processPercent = isPercentage(n);
        n = mathMin(max, mathMax(0, parseFloat(n)));

        // Automatically convert percentage into number
        if (processPercent) {
            n = parseInt(n * max, 10) / 100;
        }

        // Handle floating point rounding errors
        if (Math.abs(n - max) < 0.000001) {
            return 1;
        }

        // Convert into [0, 1] range if it isn't already
        return n % max / parseFloat(max);
    }

    // Force a number between 0 and 1
    function clamp01(val) {
        return mathMin(1, mathMax(0, val));
    }

    // Parse a base-16 hex value into a base-10 integer
    function parseIntFromHex(val) {
        return parseInt(val, 16);
    }

    // Need to handle 1.0 as 100%, since once it is a number, there is no difference between it and 1
    // <http://stackoverflow.com/questions/7422072/javascript-how-to-detect-number-as-a-decimal-including-1-0>
    function isOnePointZero(n) {
        return typeof n == "string" && n.indexOf('.') != -1 && parseFloat(n) === 1;
    }

    // Check to see if string passed in is a percentage
    function isPercentage(n) {
        return typeof n === "string" && n.indexOf('%') != -1;
    }

    // Force a hex value to have 2 characters
    function pad2(c) {
        return c.length == 1 ? '0' + c : '' + c;
    }

    // Replace a decimal with it's percentage value
    function convertToPercentage(n) {
        if (n <= 1) {
            n = n * 100 + "%";
        }

        return n;
    }

    // Converts a decimal to a hex value
    function convertDecimalToHex(d) {
        return Math.round(parseFloat(d) * 255).toString(16);
    }
    // Converts a hex value to a decimal
    function convertHexToDecimal(h) {
        return parseIntFromHex(h) / 255;
    }

    var matchers = function () {

        // <http://www.w3.org/TR/css3-values/#integers>
        var CSS_INTEGER = "[-\\+]?\\d+%?";

        // <http://www.w3.org/TR/css3-values/#number-value>
        var CSS_NUMBER = "[-\\+]?\\d*\\.\\d+%?";

        // Allow positive/negative integer/number.  Don't capture the either/or, just the entire outcome.
        var CSS_UNIT = "(?:" + CSS_NUMBER + ")|(?:" + CSS_INTEGER + ")";

        // Actual matching.
        // Parentheses and commas are optional, but not required.
        // Whitespace can take the place of commas or opening paren
        var PERMISSIVE_MATCH3 = "[\\s|\\(]+(" + CSS_UNIT + ")[,|\\s]+(" + CSS_UNIT + ")[,|\\s]+(" + CSS_UNIT + ")\\s*\\)?";
        var PERMISSIVE_MATCH4 = "[\\s|\\(]+(" + CSS_UNIT + ")[,|\\s]+(" + CSS_UNIT + ")[,|\\s]+(" + CSS_UNIT + ")[,|\\s]+(" + CSS_UNIT + ")\\s*\\)?";

        return {
            CSS_UNIT: new RegExp(CSS_UNIT),
            rgb: new RegExp("rgb" + PERMISSIVE_MATCH3),
            rgba: new RegExp("rgba" + PERMISSIVE_MATCH4),
            hsl: new RegExp("hsl" + PERMISSIVE_MATCH3),
            hsla: new RegExp("hsla" + PERMISSIVE_MATCH4),
            hsv: new RegExp("hsv" + PERMISSIVE_MATCH3),
            hsva: new RegExp("hsva" + PERMISSIVE_MATCH4),
            hex3: /^#?([0-9a-fA-F]{1})([0-9a-fA-F]{1})([0-9a-fA-F]{1})$/,
            hex6: /^#?([0-9a-fA-F]{2})([0-9a-fA-F]{2})([0-9a-fA-F]{2})$/,
            hex4: /^#?([0-9a-fA-F]{1})([0-9a-fA-F]{1})([0-9a-fA-F]{1})([0-9a-fA-F]{1})$/,
            hex8: /^#?([0-9a-fA-F]{2})([0-9a-fA-F]{2})([0-9a-fA-F]{2})([0-9a-fA-F]{2})$/
        };
    }();

    // `isValidCSSUnit`
    // Take in a single string / number and check to see if it looks like a CSS unit
    // (see `matchers` above for definition).
    function isValidCSSUnit(color) {
        return !!matchers.CSS_UNIT.exec(color);
    }

    // `stringInputToObject`
    // Permissive string parsing.  Take in a number of formats, and output an object
    // based on detected format.  Returns `{ r, g, b }` or `{ h, s, l }` or `{ h, s, v}`
    function stringInputToObject(color) {

        color = color.replace(trimLeft, '').replace(trimRight, '').toLowerCase();
        var named = false;
        if (names[color]) {
            color = names[color];
            named = true;
        } else if (color == 'transparent') {
            return { r: 0, g: 0, b: 0, a: 0, format: "name" };
        }

        // Try to match string input using regular expressions.
        // Keep most of the number bounding out of this function - don't worry about [0,1] or [0,100] or [0,360]
        // Just return an object and let the conversion functions handle that.
        // This way the result will be the same whether the tinycolor is initialized with string or object.
        var match;
        if (match = matchers.rgb.exec(color)) {
            return { r: match[1], g: match[2], b: match[3] };
        }
        if (match = matchers.rgba.exec(color)) {
            return { r: match[1], g: match[2], b: match[3], a: match[4] };
        }
        if (match = matchers.hsl.exec(color)) {
            return { h: match[1], s: match[2], l: match[3] };
        }
        if (match = matchers.hsla.exec(color)) {
            return { h: match[1], s: match[2], l: match[3], a: match[4] };
        }
        if (match = matchers.hsv.exec(color)) {
            return { h: match[1], s: match[2], v: match[3] };
        }
        if (match = matchers.hsva.exec(color)) {
            return { h: match[1], s: match[2], v: match[3], a: match[4] };
        }
        if (match = matchers.hex8.exec(color)) {
            return {
                r: parseIntFromHex(match[1]),
                g: parseIntFromHex(match[2]),
                b: parseIntFromHex(match[3]),
                a: convertHexToDecimal(match[4]),
                format: named ? "name" : "hex8"
            };
        }
        if (match = matchers.hex6.exec(color)) {
            return {
                r: parseIntFromHex(match[1]),
                g: parseIntFromHex(match[2]),
                b: parseIntFromHex(match[3]),
                format: named ? "name" : "hex"
            };
        }
        if (match = matchers.hex4.exec(color)) {
            return {
                r: parseIntFromHex(match[1] + '' + match[1]),
                g: parseIntFromHex(match[2] + '' + match[2]),
                b: parseIntFromHex(match[3] + '' + match[3]),
                a: convertHexToDecimal(match[4] + '' + match[4]),
                format: named ? "name" : "hex8"
            };
        }
        if (match = matchers.hex3.exec(color)) {
            return {
                r: parseIntFromHex(match[1] + '' + match[1]),
                g: parseIntFromHex(match[2] + '' + match[2]),
                b: parseIntFromHex(match[3] + '' + match[3]),
                format: named ? "name" : "hex"
            };
        }

        return false;
    }

    function validateWCAG2Parms(parms) {
        // return valid WCAG2 parms for isReadable.
        // If input parms are invalid, return {"level":"AA", "size":"small"}
        var level, size;
        parms = parms || { "level": "AA", "size": "small" };
        level = (parms.level || "AA").toUpperCase();
        size = (parms.size || "small").toLowerCase();
        if (level !== "AA" && level !== "AAA") {
            level = "AA";
        }
        if (size !== "small" && size !== "large") {
            size = "small";
        }
        return { "level": level, "size": size };
    }

    // Node: Export function
    if (typeof module !== "undefined" && module.exports) {
        module.exports = tinycolor;
    }
    // AMD/requirejs: Define the module
    else if (true) {
            !(__WEBPACK_AMD_DEFINE_RESULT__ = function () {
                return tinycolor;
            }.call(exports, __webpack_require__, exports, module),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
        }
        // Browser: Expose to window
        else {
                window.tinycolor = tinycolor;
            }
})(Math);

/***/ }),
/* 21 */
/***/ (function(module, exports, __webpack_require__) {

var agent = __webpack_require__(5);
var color = __webpack_require__(2);

function world() {
    this.agents = [];
    this.p2 = new p2.World({
        gravity: [0, 0]
    });

    this.p2.solver.tolerance = 5e-2;
    this.p2.solver.iterations = 15;
    this.p2.setGlobalStiffness(1e6);
    this.p2.setGlobalRelaxation(5);

    this.age = 0.0;
    this.timer = 0;

    this.chartData = {};
    this.chartEphemeralData = [];
    this.chartFrequency = 60;
    this.chartDataPoints = 200;
    this.smoothReward = 0;

    this.plotRewardOnly = false;

    this.obstacles = [];

    var input = 118,
        actions = 2;
    this.brains = {

        actor: new window.neurojs.Network.Model([{ type: 'input', size: input }, { type: 'fc', size: 50, activation: 'relu' }, { type: 'fc', size: 50, activation: 'relu' }, { type: 'fc', size: 50, activation: 'relu', dropout: 0.5 }, { type: 'fc', size: actions, activation: 'tanh' }, { type: 'regression' }]),

        critic: new window.neurojs.Network.Model([{ type: 'input', size: input + actions }, { type: 'fc', size: 100, activation: 'relu' }, { type: 'fc', size: 100, activation: 'relu' }, { type: 'fc', size: 1 }, { type: 'regression' }])

    };

    this.brains.shared = new window.neurojs.Shared.ConfigPool();

    this.brains.shared.set('actor', this.brains.actor.newConfiguration());
    this.brains.shared.set('critic', this.brains.critic.newConfiguration());
};

world.prototype.addBodyFromCompressedPoints = function (outline) {
    if (outline.length % 2 !== 0) {
        throw 'Invalid outline.';
    }

    var points = [];
    for (var i = 0; i < outline.length / 2; i++) {
        var x = outline[i * 2 + 0];
        var y = outline[i * 2 + 1];
        points.push([x, y]);
    }

    this.addBodyFromPoints(points);
};

world.prototype.addBodyFromPoints = function (points) {
    var body = new p2.Body({ mass: 0.0 });
    body.color = color.randomPastelHex();

    if (!body.fromPolygon(points.slice(0), { removeCollinearPoints: 0.1 })) {
        return;
    }

    var outline = new Float64Array(points.length * 2);
    for (var i = 0; i < points.length; i++) {
        outline[i * 2 + 0] = points[i][0];
        outline[i * 2 + 1] = points[i][1];
    }

    body.outline = outline;
    this.addObstacle(body);
};

world.prototype.addObstacle = function (obstacle) {
    this.p2.addBody(obstacle);
    this.obstacles.push(obstacle);
};

world.prototype.addWall = function (start, end, width) {
    var w = 0,
        h = 0,
        pos = [];
    if (start[0] === end[0]) {
        // hor
        h = end[1] - start[1];
        w = width;
        pos = [start[0], start[1] + 0.5 * h];
    } else if (start[1] === end[1]) {
        // ver
        w = end[0] - start[0];
        h = width;
        pos = [start[0] + 0.5 * w, start[1]];
    } else throw 'error';

    // Create box
    var b = new p2.Body({
        mass: 0.0,
        position: pos
    });

    var rectangleShape = new p2.Box({ width: w, height: h });
    // rectangleShape.color = 0xFFFFFF
    b.hidden = true;
    b.addShape(rectangleShape);
    this.p2.addBody(b);

    return b;
};

world.prototype.addPolygons = function (polys) {

    for (var i = 0; i < polys.length; i++) {
        var points = polys[i];
        var b = new p2.Body({ mass: 0.0 });
        if (b.fromPolygon(points, {
            removeCollinearPoints: 0.1,
            skipSimpleCheck: true
        })) {
            this.p2.addBody(b);
        }
    }
};

world.prototype.init = function (renderer) {
    window.addEventListener('resize', this.resize.bind(this, renderer), false);

    var w = renderer.viewport.width / renderer.viewport.scale;
    var h = renderer.viewport.height / renderer.viewport.scale;
    var wx = w / 2,
        hx = h / 2;

    this.addWall([-wx - 0.25, -hx], [-wx - 0.25, hx], 0.5);
    this.addWall([wx + 0.25, -hx], [wx + 0.25, hx], 0.5);
    this.addWall([-wx, -hx - 0.25], [wx, -hx - 0.25], 0.5);
    this.addWall([-wx, hx + 0.25], [wx, hx + 0.25], 0.5);

    this.size = { w, h };
};

world.prototype.populate = function (n) {
    for (var i = 0; i < n; i++) {
        var ag = new agent({}, this);
        this.agents.push(ag);
    }
};

world.prototype.resize = function (renderer) {};

world.prototype.step = function (dt) {
    if (dt >= 0.02) dt = 0.02;

    ++this.timer;

    var loss = 0.0,
        reward = 0.0,
        agentUpdate = false;
    for (var i = 0; i < this.agents.length; i++) {
        agentUpdate = this.agents[i].step(dt);
        loss += this.agents[i].loss;
        reward += this.agents[i].reward;
    }

    this.brains.shared.step();

    if (!this.plotting && (this.agents[0].brain.training || this.plotRewardOnly) && 1 === this.timer % this.chartFrequency) {
        this.plotting = true;
    }

    if (this.plotting) {
        this.chartEphemeralData.push({
            loss: loss / this.agents.length,
            reward: reward / this.agents.length
        });

        if (this.timer % this.chartFrequency == 0) {
            this.updateChart();
            this.chartEphemeralData = [];
        }
    }

    this.p2.step(1 / 60, dt, 10);
    this.age += dt;
};

world.prototype.updateChart = function () {
    var point = { loss: 0, reward: 0 };

    if (this.chartEphemeralData.length !== this.chartFrequency) {
        throw 'error';
    }

    for (var i = 0; i < this.chartFrequency; i++) {
        var subpoint = this.chartEphemeralData[i];
        for (var key in point) {
            point[key] += subpoint[key] / this.chartFrequency;
        }
    }

    if (point.reward) {
        var f = 1e-2;
        this.smoothReward = this.smoothReward * (1.0 - f) + f * point.reward;
        point.smoothReward = this.smoothReward;
    }

    var series = [];
    for (var key in point) {
        if (!(key in this.chartData)) {
            this.chartData[key] = [];
        }

        this.chartData[key].push(point[key]);

        if (this.chartData[key].length > this.chartDataPoints) {
            this.chartData[key] = this.chartData[key].slice(-this.chartDataPoints);
        }

        if (this.plotRewardOnly && key !== 'reward' && key !== 'smoothReward') {
            series.push({
                name: key,
                data: []
            });
        } else {
            series.push({
                name: key,
                data: this.chartData[key]
            });
        }
    }

    this.chart.update({
        series
    });
};

world.prototype.export = function () {
    var contents = [];
    contents.push({
        obstacles: this.obstacles.length
    });

    for (var i = 0; i < this.obstacles.length; i++) {
        contents.push(this.obstacles[i].outline);
    }

    var agents = [];
    for (var i = 0; i < this.agents.length; i++) {
        agents.push({
            location: this.agents[i].car.chassisBody.position,
            angle: this.agents[i].car.chassisBody.angle
        });
    }

    contents.push(agents);

    return window.neurojs.Binary.Writer.write(contents);
};

world.prototype.clearObstacles = function () {
    for (var i = 0; i < this.obstacles.length; i++) {
        this.p2.removeBody(this.obstacles[i]);
    }

    this.obstacles = [];
};

world.prototype.import = function (buf) {
    this.clearObstacles();

    var contents = window.neurojs.Binary.Reader.read(buf);
    var j = -1;
    var meta = contents[++j];

    for (var i = 0; i < meta.obstacles; i++) {
        this.addBodyFromCompressedPoints(contents[++j]);
    }

    var agents = contents[++j];

    if (agents.length !== this.agents.length) {
        throw 'error';
    }

    for (var i = 0; i < agents.length; i++) {
        this.agents[i].car.chassisBody.position = agents[i].location;
        this.agents[i].car.chassisBody.angle = agents[i].angle;
    }
};

module.exports = world;

/***/ }),
/* 22 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var Size = __webpack_require__(1);

// http://arxiv.org/pdf/1505.05424.pdf
class VariationalBayesianLayer {

	constructor(input, opt) {
		opt.size = Size.derive(opt.size);

		this.dimensions = {
			input,
			output: opt.size,
			parameters: 2 * (input.length * opt.size.length + opt.size.length) // mean and std
		};

		this.storage = {
			sample: input.length * opt.size.length + opt.size.length,
			weights: input.length * opt.size.length + opt.size.length
		};
	}

	forward(ctx) {
		var sum = 0.0,
		    X = this.dimensions.input.length,
		    Y = this.dimensions.output.length;
		var inpw = ctx.input.w,
		    outw = ctx.output.w,
		    paramw = ctx.params.w;
		var sampled = ctx.sample,
		    weights = ctx.weights,
		    epsilon = 0;
		var mu, std, w, b;

		if (ctx.state.options.uncertainty) {
			return this.uncertainty(ctx);
		}

		for (var i = 0; i < Y; i++) {
			sum = 0.0;
			for (var j = 0; j < X; j++) {
				mu = paramw[(i * X + j) * 2 + 0];
				std = Math.log(1 + Math.exp(paramw[(i * X + j) * 2 + 1]));

				sampled[i * X + j] = epsilon = Math.randn();
				weights[i * X + j] = w = mu + std * epsilon;

				sum += inpw[j] * w;
			}

			mu = paramw[(X * Y + i) * 2 + 0];
			std = Math.log(1 + Math.exp(paramw[(X * Y + i) * 2 + 1]));

			sampled[X * Y + i] = epsilon = Math.randn();
			weights[X * Y + i] = b = mu + std * epsilon;

			outw[i] = sum + b;
		}
	}

	uncertainty(ctx) {
		var sum = 0.0,
		    X = this.dimensions.input.length,
		    Y = this.dimensions.output.length;
		var inpw = ctx.input.w,
		    outw = ctx.output.w,
		    paramw = ctx.params.w;
		var std,
		    mu,
		    w,
		    b,
		    dir = ctx.state.options.uncertainty;

		for (var i = 0; i < Y; i++) {
			sum = 0.0;
			for (var j = 0; j < X; j++) {
				mu = paramw[(i * X + j) * 2 + 0];
				std = Math.log(1 + Math.exp(paramw[(i * X + j) * 2 + 1]));
				w = mu + dir * std;

				sum += inpw[j] * w;
			}

			mu = paramw[(X * Y + i) * 2 + 0];
			std = Math.log(1 + Math.exp(paramw[(X * Y + i) * 2 + 1]));
			b = mu + dir * std;

			outw[i] = sum + b;
		}
	}

	backward(ctx) {
		var sum = 0.0,
		    X = this.dimensions.input.length,
		    Y = this.dimensions.output.length;
		var inpw = ctx.input.w,
		    outw = ctx.output.w,
		    paramw = ctx.params.w;
		var inpdw = ctx.input.dw,
		    outdw = ctx.output.dw,
		    paramdw = ctx.params.dw;
		var sampled = ctx.sample,
		    weights = ctx.weights;

		for (var i = 0; i < X; i++) {
			sum = 0.0;
			for (var j = 0; j < Y; j++) {
				paramdw[(j * X + i) * 2 + 0] = inpw[i] * outdw[j];
				paramdw[(j * X + i) * 2 + 1] = inpw[i] * outdw[j] * sampled[j * X + i] / (1.0 + Math.exp(-paramw[(j * X + i) * 2 + 1]));
				sum += weights[j * X + i] * outdw[j];
			}

			inpdw[i] = sum;
		}

		for (var i = 0; i < Y; i++) {
			paramdw[(X * Y + i) * 2 + 0] = outdw[i];
			paramdw[(X * Y + i) * 2 + 1] = outdw[i] * sampled[X * Y + i] / (1.0 + Math.exp(-paramw[(X * Y + i) * 2 + 1]));
		}
	}

	initialize(params) {
		var H = this.dimensions.parameters / 2;
		var elements = this.dimensions.input.length + this.dimensions.output.length;
		var scale = Math.sqrt(2.0 / elements);

		for (var i = 0; i < H; i += 2) {
			params.w[i] = Math.randn() * scale;
			params.w[i + 1] = Math.randn();
		}
	}

}

class ConfidenceLayer {

	constructor(input, opt) {

		this.dimensions = {
			input,
			output: new Size(1, 1, input.length / 2),
			parameters: 0
		};

		this.storage = {
			sample: this.dimensions.output.length
		};
	}

	forward(ctx) {
		var Y = this.dimensions.output.length;
		var inpw = ctx.input.w,
		    outw = ctx.output.w;
		var sampled = ctx.sample;

		for (var i = 0; i < Y; i++) {
			var mu = inpw[i * 2 + 0];
			var std = inpw[i * 2 + 1];

			sampled[i] = Math.randn();
			outw[i] = mu + sampled[i] * std;
		}
	}

	backward(ctx) {
		var Y = this.dimensions.output.length;
		var inpw = ctx.input.w,
		    outw = ctx.output.w;
		var inpdw = ctx.input.dw,
		    outdw = ctx.output.dw;
		var sampled = ctx.sample;

		for (var i = 0; i < Y; i++) {
			inpdw[i * 2 + 0] = outdw[i];
			inpdw[i * 2 + 1] = sampled[i] * outdw[i];
		}
	}

}

module.exports = {
	VariationalBayesianLayer, ConfidenceLayer
};

/***/ }),
/* 23 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var Size = __webpack_require__(1);

class FullyConnectedLayer {

	constructor(input, opt) {
		opt.size = Size.derive(opt.size);

		this.dimensions = {
			input,
			output: opt.size,
			parameters: input.length * opt.size.length + opt.size.length
		};
	}

	forward(ctx) {
		var sum = 0.0,
		    X = this.dimensions.input.length,
		    Y = this.dimensions.output.length;
		var inpw = ctx.input.w,
		    outw = ctx.output.w,
		    paramw = ctx.params.w;

		for (var i = 0; i < Y; i++) {
			sum = 0.0;
			for (var j = 0; j < X; j++) {
				sum += inpw[j] * paramw[i * X + j];
			}

			outw[i] = sum + paramw[X * Y + i];
		}

		// outw.set(this.fwd(inpw, paramw));
	}

	backward(ctx) {
		var sum = 0.0,
		    X = this.dimensions.input.length,
		    Y = this.dimensions.output.length;
		var inpw = ctx.input.w,
		    outw = ctx.output.w,
		    paramw = ctx.params.w;
		var inpdw = ctx.input.dw,
		    outdw = ctx.output.dw,
		    paramdw = ctx.params.dw;

		for (var i = 0; i < X; i++) {
			sum = 0.0;
			for (var j = 0; j < Y; j++) {
				sum += paramw[j * X + i] * outdw[j];
				paramdw[j * X + i] = inpw[i] * outdw[j];
			}

			inpdw[i] = sum;
		}

		for (var i = 0; i < Y; i++) {
			paramdw[X * Y + i] = outdw[i];
		}
	}

	initialize(params) {
		if (this.options.init) {
			params.w.randf(this.options.init[0], this.options.init[1]);
			return;
		}

		var X = this.dimensions.input.length,
		    Y = this.dimensions.output.length;
		var dropout = this.options.dropout || 0;
		var elements = (1 - dropout) * (this.dimensions.input.length + this.dimensions.output.length);
		var scale = Math.sqrt(2.0 / elements);
		params.w.randn(0.0, scale);

		if (this.options.customInit) {
			this.options.customInit(params.w);
		}
	}

}

module.exports = {
	FullyConnectedLayer
};

/***/ }),
/* 24 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


class DropOutLayer {

	constructor(input, opt) {
		this.dimensions = {
			input,
			output: input,
			parameters: 0
		};

		this.probability = opt.probability;
		this.storage = {
			activations: input
		};
	}

	forward(ctx) {
		var X = this.dimensions.input.length;
		var inpw = ctx.input.w,
		    outw = ctx.output.w;
		var prob = this.probability,
		    act = ctx.activations;

		// if (ctx.state.options.learning !== true) {
		// 	for (var i = 0; i < X; i++)
		// 		outw[i] = inpw[i] * prob 

		// 	return 
		// }

		for (var i = 0; i < X; i++) {
			if (Math.random() < prob) {
				// dropping out
				outw[i] = 0.0;
				act[i] = 0.0;
			} else {
				outw[i] = inpw[i] / (1.0 - prob);
				act[i] = 1.0;
			}
		}
	}

	backward(ctx) {
		var X = this.dimensions.input.length;
		var inpw = ctx.input.w,
		    outw = ctx.output.w;
		var inpdw = ctx.input.dw,
		    outdw = ctx.output.dw;
		var prob = this.probability,
		    act = ctx.activations;

		// if (ctx.state.options.learning !== true) {
		// 	// for (var i = 0; i < X; i++)
		// 	// 	inpdw[i] = outdw[i] * prob 

		// 	return
		// }

		for (var i = 0; i < X; i++) {
			inpdw[i] = act[i] * outdw[i] / (1.0 - prob);
		}
	}

}

module.exports = {
	DropOutLayer
};

/***/ }),
/* 25 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var Size = __webpack_require__(1);

class InputLayer {

	constructor(inp, opt) {
		this.dimensions = {
			input: Size.derive(opt.size),
			output: Size.derive(opt.size),
			parameters: 0
		};

		this.input = true;
		this.passthrough = true;
	}

	toInputVector(input, out) {
		if (input === undefined) return;

		if (Number.isInteger(input) && input < this.dimensions.intrinsic) {
			out.fill(0.0);
			out[input] = 1.0;
		} else if (input.length === out.length) {
			out.set(input);
		} else {
			throw 'invalid input format';
		}
	}

}

module.exports = {
	InputLayer
};

/***/ }),
/* 26 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";



class UhlenbeckOrnsteinNoiseLayer {

	constructor(input, opt) {
		this.dimensions = {
			input,
			output: input,
			parameters: 0
		};

		this.theta = opt.theta || 0.15;
		this.sigma = opt.sigma || 0.3;
		this.delta = opt.delta || 0.1;

		this.storage = {
			noise: input
		};
	}

	forward(ctx) {
		var X = this.dimensions.input.length;
		var outw = ctx.output.w,
		    inpw = ctx.input.w;

		var alpha = 0.3;
		for (var i = 0; i < X; i++) {
			outw[i] = (1 - alpha) * inpw[i] + alpha * (ctx.noise[i] = Math.uhlenbeckOrnstein(ctx.noise[i], this.theta, this.sigma, this.delta));
		}
	}

	backward(ctx) {
		ctx.input.dw.set(ctx.output.dw);
	}

}

module.exports = {
	UhlenbeckOrnsteinNoiseLayer
};

/***/ }),
/* 27 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


class NonLinearityLayer {

	constructor(input, opt) {
		this.dimensions = {
			input,
			output: input,
			parameters: 0
		};
	}

}

class SigmoidLayer extends NonLinearityLayer {

	forward(ctx) {
		var X = this.dimensions.input.length;
		var inpw = ctx.input.w,
		    outw = ctx.output.w;

		for (var i = 0; i < X; i++) {
			outw[i] = 1 / (1 + Math.exp(-inpw[i]));
		}
	}

	backward(ctx) {
		var X = this.dimensions.input.length;
		var inpw = ctx.input.w,
		    outw = ctx.output.w;
		var inpdw = ctx.input.dw,
		    outdw = ctx.output.dw;

		for (var i = 0; i < X; i++) {
			inpdw[i] = outw[i] * (1.0 - outw[i]) * outdw[i];
		}
	}

}

class TanhLayer extends NonLinearityLayer {

	forward(ctx) {
		var X = this.dimensions.input.length;
		var inpw = ctx.input.w,
		    outw = ctx.output.w;
		var y = 0.0;

		for (var i = 0; i < X; i++) {
			y = Math.exp(2 * inpw[i]);
			outw[i] = (y - 1) / (y + 1);
		}
	}

	backward(ctx) {
		var X = this.dimensions.input.length;
		var inpw = ctx.input.w,
		    outw = ctx.output.w;
		var inpdw = ctx.input.dw,
		    outdw = ctx.output.dw;

		for (var i = 0; i < X; i++) {
			inpdw[i] = (1 - outw[i] * outw[i]) * outdw[i];
		}
	}

}

class ReLuLayer extends NonLinearityLayer {

	constructor(input, opt) {
		super(input, opt);
		this.leaky = opt.leaky || 0;
	}

	forward(ctx) {
		var X = this.dimensions.input.length;
		var inpw = ctx.input.w,
		    outw = ctx.output.w;
		var y = 0.0;

		for (var i = 0; i < X; i++) {
			outw[i] = inpw[i] > 0.0 ? inpw[i] : this.leaky * inpw[i];
		}
	}

	backward(ctx) {
		var X = this.dimensions.input.length;
		var inpw = ctx.input.w,
		    outw = ctx.output.w;
		var inpdw = ctx.input.dw,
		    outdw = ctx.output.dw;

		for (var i = 0; i < X; i++) {
			inpdw[i] = inpw[i] > 0.0 ? outdw[i] : this.leaky * outdw[i];
		}
	}

}

module.exports = {
	SigmoidLayer, TanhLayer, ReLuLayer
};

/***/ }),
/* 28 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


class OutputLayer {

    constructor(inp, opt) {
        this.dimensions = {
            input: inp,
            output: inp,
            parameters: 0
        };

        this.output = true;
    }

    result(ctx) {
        return ctx.output.w.clone();
    }

}

class SoftmaxLayer extends OutputLayer {

    forward(ctx) {
        var X = this.dimensions.input.length;
        var inpw = ctx.input.w,
            outw = ctx.output.w;
        var inpmax = -Infinity;

        for (var i = 0; i < X; ++i) if (inpw[i] > inpmax) inpmax = inpw[i];

        var expsum = 0.0;
        for (var i = 0; i < X; ++i) expsum += outw[i] = Math.exp(inpw[i] - inpmax);

        for (var i = 0; i < X; ++i) outw[i] /= expsum;
    }

    backward(ctx) {
        var X = this.dimensions.input.length;
        var inpdw = ctx.input.dw;
        var outdw = ctx.output.dw,
            outw = ctx.output.w;

        for (var i = 0; i < X; i++) {
            var sum = outw[i] * (1 - outw[i]) * outdw[i];

            for (var j = 0; j < X; j++) {
                if (i !== j) sum -= outw[j] * outw[i] * outdw[j];
            }

            inpdw[i] = sum;
        }
    }

    loss(ctx, desired, target) {
        return -Math.log(ctx.output.w[desired]);
    }

    toGradientVector(desired, actual, out) {
        if (Number.isInteger(desired) !== true || desired >= this.size) throw 'target must be class index in softmax';

        for (var i = 0; i < this.size; i++) {
            out[i] = actual[i] - (desired === i ? 1.0 : 0.0);
        }
    }

}

class RegressionLayer extends OutputLayer {

    constructor(inp, opt) {
        super(inp, opt);
        this.passthrough = true;
    }

    loss(ctx, desired) {
        var loss = 0.0;
        var grads = this.toGradientVector(desired, ctx.output.w);

        for (var i = 0; i < this.dimensions.input.length; i++) {
            loss += 0.5 * grads[i] * grads[i];
        }

        return loss;
    }

    toGradientVector(desired, actual, out) {
        var X = this.dimensions.input.length;

        if (out === undefined) {
            out = new Float64Array(X);
        }

        // target is maximizing argmax, set n-th value to 1, rest to 0
        if (X > 1 && !isNaN(desired) && Number.isInteger(desired) && desired < X) {
            for (var i = 0; i < X; ++i) {
                out[i] = actual[i] - (i === desired ? 1.0 : 0.0);
            }
        }

        // single value output
        else if (X === 1 && !isNaN(desired)) {
                out[0] = actual[0] - desired;
            } else if (desired instanceof Array || desired instanceof Float64Array) {
                for (var i = 0; i < out.length; ++i) {
                    out[i] = actual[i] - desired[i];
                }
            } else {
                throw 'invalid target';
            }

        return out;
    }

}

module.exports = {
    RegressionLayer, SoftmaxLayer
};

/***/ }),
/* 29 */
/***/ (function(module, exports) {

class WebLoader {

    static load(path, completion) {
        var request = new XMLHttpRequest();
        request.open("GET", path, true);
        request.responseType = "arraybuffer";
        request.addEventListener('load', function (e) {
            completion(request.response);
        });

        request.send(null);
    }

    static loadConfig(path, model, completion) {
        var config = model.newConfiguration();
        WebLoader.loadConfigInto(path, config, completion.bind(null, config));
    }

    static loadConfigInto(path, config, completion) {
        WebLoader.load(path, function (buffer) {
            var weights = new Float64Array(buffer);
            config.read(weights);
            completion();
        });
    }

    static loadAgent(path, agent, completion) {
        agent.ready = false;

        WebLoader.load(path, function (buffer) {
            var weights = new Float64Array(buffer);
            agent.import(weights);
            agent.ready = true;

            if (completion) completion(agent);
        });
    }

}

module.exports = WebLoader;

/***/ }),
/* 30 */
/***/ (function(module, exports) {

if (Float64Array.prototype.fill === undefined) Float64Array.prototype.fill = function (v) {
    for (var i = 0; i < this.length; i++) {
        this[i] = v;
    }
};

Object.assign(Math, {

    statistics: true,

    randn() {
        var U1,
            U2 = this.randn.U2,
            W,
            mult;
        if (U2) {
            this.randn.U2 = null; // deactivate for next time
            return U2;
        }

        do {
            U1 = -1 + this.random() * 2;
            U2 = -1 + this.random() * 2;
            W = U1 * U1 + U2 * U2;
        } while (W >= 1 || W === 0);

        mult = Math.sqrt(-2 * Math.log(W) / W);
        this.randn.U2 = U2 * mult;

        return U1 * mult;
    },

    randf(a, b) {
        return this.random() * (b - a) + a;
    },

    randi(a, b) {
        return a + Math.floor(Math.random() * (b - a));
    },

    uhlenbeckOrnstein(old, theta, sigma, dt) {
        return old - theta * old * dt + Math.sqrt(dt) * Math.randn(0.0, sigma);
    }

});

Object.assign(Array, {

    random(arr) {
        return arr[Math.floor(Math.random() * arr.length)];
    },

    randomAndRemove() {
        var index = Math.floor(Math.random() * this.length);
        var value = this[index];
        this.splice(index, 1);

        return value;
    },

    sum(arr, valueFunc) {
        valueFunc = valueFunc || (x => x);
        var sum = 0.0;
        for (var i = 0; i < arr.length; i++) {
            sum += valueFunc(arr[i]);
        }

        return sum;
    },

    lowest(valueFunc) {
        return this.reduce((a, b) => valueFunc(a) < valueFunc(b) ? a : b);
    },

    highest(valueFunc) {
        return this.reduce((a, b) => valueFunc(a) > valueFunc(b) ? a : b);
    },

    sample(probFunc) {
        var des = Math.random();
        var pos = 0.0;
        for (var i = 0; i < this.children.length; i++) {
            if (des < (pos += prob[i])) return this.children[i];
        }

        return this.children[this.children.length - 1];
    }

});

Object.assign(Float64Array, {

    filled(n, v) {
        return new Float64Array(n).fill(v);
    },

    oneHot(n, N) {
        var vec = new Float64Array(N);
        vec[n] = 1.0;
        return vec;
    },

    noise(N, a, b) {
        var vec = new Float64Array(N);
        vec.randf(a || -1, b || 1);
        return vec;
    }

});

Object.assign(Float64Array.prototype, {

    randn(mu, std) {
        for (var i = 0; i < this.length; i++) {
            this[i] = mu + std * Math.randn();
        }
    },

    randf(a, b) {
        for (var i = 0; i < this.length; i++) {
            this[i] = Math.randf(a, b);
        }
    },

    maxi() {
        var maxv = -Infinity,
            maxi = 0.0;
        for (var i = 0; i < this.length; i++) {
            if (this[i] > maxv) {
                maxv = this[i];maxi = i;
            }
        }

        return maxi;
    },

    clone() {
        var copied = new Float64Array(this.length);
        copied.set(this);
        return copied;
    },

    diff(x, y) {
        for (var i = 0; i < this.length; i++) {
            this[i] = x[i] - y[i];
        }
    },

    add(x, y) {
        for (var i = 0; i < this.length; i++) {
            this[i] = x[i] + y[i];
        }
    },

    mult(x, y) {
        for (var i = 0; i < this.length; i++) {
            this[i] = x[i] * y;
        }
    }

});

/***/ }),
/* 31 */
/***/ (function(module, exports, __webpack_require__) {

var Size = __webpack_require__(1);

module.exports = class Tensor {

	constructor(size) {
		this.size = Size.derive(size);
		this.w = new Float64Array(this.size.length);
		this.dw = new Float64Array(this.size.length);
	}

};

/***/ }),
/* 32 */
/***/ (function(module, exports) {

class Window {

	constructor(n) {
		this.list = [];
		this.length = n;
	}

	push(value) {
		this.list.unshift(value);

		if (this.list.length > this.length) {
			this.list.pop();
		}
	}

	get(nth) {
		return this.list[nth];
	}

	get size() {
		return this.list.length;
	}

}

module.exports = Window;

/***/ }),
/* 33 */
/***/ (function(module, exports, __webpack_require__) {

// var network = require('../network.js')
var Window = __webpack_require__(32);
var Experience = __webpack_require__(36);
var Buffers = __webpack_require__(10);
var DQN = __webpack_require__(35);
var DDPG = __webpack_require__(34);

/**
 * The Agent class represents the
 * reinforcement-learner.
 */
class Agent {

	constructor(opt) {

		this.options = Object.assign({

			type: 'q-learning', // sarsa or q-learning
			experience: 25e3,
			temporalWindow: 0,

			learningPerTick: 64,
			startLearningAt: 1000,

			buffer: Buffers.PrioritizedReplayBuffer,

			algorithm: 'ddpg',

			discount: opt.discount || 0.9,
			beta: 0.15 }, opt);

		// options
		this.states = this.options.states; // state space
		this.actions = this.options.actions; // action space
		this.input = Agent.getInputDimension(this.states, this.actions, this.options.temporalWindow); // extended state (over time)

		// settings
		this.buffer = new this.options.buffer(this.options.experience);
		this.history = {
			states: new Window(Math.max(2, this.options.temporalWindow)),
			actions: new Window(Math.max(2, this.options.temporalWindow)),
			inputs: new Window(2),
			rewards: new Window(2)
		};

		this.age = 1;
		this.learning = true;
		this.ready = true;

		switch (this.options.algorithm) {
			case 'dqn':
				this.algorithm = new DQN(this);break;
			case 'ddpg':
				this.algorithm = new DDPG(this);break;
			default:
				throw 'unknown algorithm';
		}
	}

	/**
  * Let the agent make an action, includes exploration through noise
  * @param  {Array} state
  * @return {Array}       An action
  */
	policy(state) {
		if (!this.ready) return;

		var input = this.getStateInputVector(state);
		var action = this.act(input);

		this.history.inputs.push(input);
		this.history.states.push(state);
		this.history.actions.push(action);
		this.acted = true;

		return action;
	}

	actionToVector(action) {
		if (action instanceof Float64Array) {
			return action;
		}

		if (Number.isInteger(action)) {
			return Float64Array.oneHot(action, this.actions);
		}

		throw 'Action is invalid';
	}

	getStateInputVector(state) {
		if (this.options.temporalWindow > 0) {
			var input = new Float64Array(this.input);
			var cursor = 0;

			for (var t = this.options.temporalWindow - 1; t >= 0; t--) {
				if (this.history.states.size > t) {
					input.set(this.history.states.get(t), cursor);
					input.set(this.actionToVector(this.history.actions.get(t)), cursor + this.states);
				}

				cursor += this.states + this.actions;
			}

			input.set(state, cursor);

			return input;
		}

		return state;
	}

	/**
  * Simulate that the agent did an action
  * @param  {Array} state
  * @param  {Array} action
  */
	simulate(state, action) {
		if (!this.ready) return;

		var input = this.getStateInputVector(state);

		this.history.inputs.push(input);
		this.history.states.push(state);
		this.history.actions.push(action);
		this.acted = true;
	}

	/**
  * Adds an experience to the buffer and replays a batch of experiences
  * @param  {Float} reward
  * @return {Float}        The loss
  */
	learn(reward) {
		if (!this.acted || !this.ready) return;

		this.acted = false;
		this.history.rewards.push(reward);

		// Learning happens always one step after actually experiencing
		if (this.history.states.size < 2 || this.learning === false) return;

		// Create new experience
		var e = new Experience(this);
		e.action0 = this.history.actions.get(1);
		e.state0 = this.history.inputs.get(1);
		e.reward0 = this.history.rewards.get(1);
		e.state1 = this.history.inputs.get(0);
		e.action1 = this.history.actions.get(0); // for SARSA only
		e.init(); // set loss etc.

		// Add experience to replay buffer
		this.buffer.add(e);

		// Get older
		++this.age;

		return this.backward();
	}

	backward() {
		if (this.options.startLearningAt > this.age) return false;

		// Set training
		this.training = true;

		// Learn batch
		var loss = this.replay();

		// Execute algorithm
		this.algorithm.learn();

		return loss;
	}

	replay() {
		var batch = this.buffer.sample(this.options.learningPerTick),
		    loss = 0.0;

		for (var i = 0; i < batch.length; i++) {
			loss += batch[i].step();
		}

		this.buffer.updateAfterLearning(batch);

		return loss / batch.length;
	}

	// 
	act(state, target) {
		return this.algorithm.act(state, target);
	}

	value(state, action, target) {
		return this.algorithm.value(state, action, target);
	}

	evaluate(state, target) {
		return this.algorithm.evaluate(state, target);
	}

	// utility functions
	export() {
		return this.algorithm.export();
	}

	static getInputDimension(states, actions, temporalWindow) {
		return states + temporalWindow * (states + actions);
	}

}

module.exports = Agent;

/***/ }),
/* 34 */
/***/ (function(module, exports, __webpack_require__) {

var network = __webpack_require__(3);
var shared = __webpack_require__(4);

var NetOnDisk = __webpack_require__(11);
var Algorithm = __webpack_require__(9);

/* Deep deterministic policy gradient */
class DDPG extends Algorithm {

	constructor(agent) {
		super();
		// options
		this.options = Object.assign({
			alpha: 0, // advantage learning (AL) http://arxiv.org/pdf/1512.04860v1.pdf; increase action-gap
			theta: 0.001 }, agent.options);

		this.actor = new shared.NetworkWrapper();
		this.critic = new shared.NetworkWrapper();

		// target networks

		var targetCreate = (wrapper, state) => {
			wrapper.live = state;

			if (this.options.theta < 1) {
				wrapper.target = wrapper.live.model.newState();
			} else {
				wrapper.target = wrapper.live;
			}
		};

		this.actor.on('set', targetCreate);
		this.critic.on('set', targetCreate);

		// network validations

		this.actor.on('set', (wrapper, state) => {
			if (state.in.w.length !== this.agent.input) {
				throw 'actor input length insufficient';
			}

			if (state.out.w.length !== this.agent.actions) {
				throw 'actor output insufficient';
			}
		});

		this.critic.on('set', (wrapper, state) => {
			if (state.in.w.length !== this.agent.input + this.agent.actions) {
				throw 'critic input length insufficient';
			}

			if (state.out.w.length !== 1) {
				throw 'critic output length insufficient';
			}
		});

		// optimizer

		this.actor.useOptimizer({
			type: 'ascent',
			method: 'adadelta',
			regularization: { l2: 1e-2 }
		});

		this.critic.useOptimizer({
			type: 'descent',
			method: 'adadelta',
			regularization: { l2: 1e-3 }
		});

		// agent
		this.agent = agent;

		this.input = agent.input;
		this.buffer = agent.buffer;

		// network weight updates
		this.targetActorUpdate = this.progressiveCopy.bind(this, this.actor);
		this.targetCriticUpdate = this.progressiveCopy.bind(this, this.critic);

		// adopt networks
		this.actor.set(this.options.actor);
		this.critic.set(this.options.critic);
	}

	act(state, target) {
		if (target) {
			return this.actor.target.forward(state);
		}

		return this.actor.live.forward(state);
	}

	value(state, action, target) {
		var net = target ? this.critic.target : this.critic.live;

		net.in.w.set(state, 0);
		net.in.w.set(action, this.input);

		return net.forward()[0];
	}

	optimize(e, descent = true) {
		var target = e.target();
		var value = e.estimate();

		var grad = value - target;
		var gradAL = grad;

		if (this.options.alpha > 0) {
			gradAL = grad + this.options.alpha * (value - this.evaluate(e.state0, true)); // advantage learning
		}

		if (descent) {
			var isw = this.buffer.getImportanceSamplingWeight(e);
			this.critic.live.backwardWithGradient(gradAL * isw);
			this.critic.live.configuration.accumulate();
			this.teach(e, isw);
		}

		return 0.5 * gradAL * gradAL; // Math.pow(this.teach(e, isw, descent) - target, 2)
	}

	teach(e, isw = 1.0, descent = true) {
		var action = this.actor.live.forward(e.state0); // which action to take?
		var val = this.value(e.state0, action); // how good will the future be, if i take this action?
		var grad = this.critic.live.derivatives(0, false); // how will the future change, if i change this action

		for (var i = 0; i < this.options.actions; i++) {
			this.actor.live.out.dw[i] = grad[this.input + i] * isw;
		}

		if (descent) {
			this.actor.live.backward(); // propagate change
			this.actor.config.accumulate();
		}
	}

	learn() {
		// Improve through batch accumuluated gradients
		this.actor.optimize();
		this.critic.optimize();

		// Copy actor and critic to target networks slowly
		this.targetNetworkUpdates();
	}

	targetNetworkUpdates() {
		this.actor.target.configuration.forEachParameter(this.targetActorUpdate);
		this.critic.target.configuration.forEachParameter(this.targetCriticUpdate);
	}

	progressiveCopy(net, param, index) {
		if (this.options.theta >= 1) {
			return;
		}

		// _ = network in use, no _ = target network
		var _theta = this.options.theta,
		    _paramw = net.config.parameters[index].w;
		var theta = 1.0 - _theta,
		    paramw = param.w;

		for (var i = 0; i < param.w.length; i++) {
			paramw[i] = _theta * _paramw[i] + theta * paramw[i];
		}
	}

	import(file) {
		var multiPart = NetOnDisk.readMultiPart(file);
		this.actor.set(multiPart.actor);
		this.critic.set(multiPart.critic);
	}

	export() {
		return NetOnDisk.writeMultiPart({
			'actor': this.actor.config,
			'critic': this.critic.config
		});
	}

}

module.exports = DDPG;

/***/ }),
/* 35 */
/***/ (function(module, exports, __webpack_require__) {

var Algorithm = __webpack_require__(9);

class DQN extends Algorithm {

	constructor(agent) {
		// options
		this.options = Object.assign({

			alpha: 0.1, // advantage learning (AL) http://arxiv.org/pdf/1512.04860v1.pdf; increase action-gap
			theta: 0.001, // soft target updates

			learningSteps: 100e3,
			learningStepsBurnin: 3e3,

			epsilonMin: 0.05,
			epsilonAtTestTime: 0.05

		}, agent.options);

		//
		this.net = agent.options.network.newState();
		this.target = this.net.model.newState(); // agent.options.target.actor.newState()
		// this.target.configuration.copyParametersFrom(this.net.configuration)

		//
		this.targetWeightCopy = this.progressiveCopy.bind(this, this.net.configuration);

		this.net.configuration.useOptimizer({
			type: 'descent',
			method: 'adadelta',
			regularization: { l2: 1e-3 }
		});

		// agent
		this.agent = agent;
		this.buffer = agent.buffer;

		this.states = this.agent.states;
		this.actions = this.agent.actions;
		this.input = this.agent.input;
	}

	// what to do?
	act(state, target) {

		if (this.agent.learning) this.epsilon = Math.max(1.0 - Math.max((this.agent.age - this.options.learningStepsBurnin) / this.options.learningSteps, 0.0), this.options.epsilonMin);else this.epsilon = this.options.epsilonAtTestTime;

		if (Math.random() <= this.epsilon) {
			return Math.randi(0, this.actions);
		}

		this.net.forward(state);

		return this.net.out.w.maxi();
	}

	// how good is an action at state
	value(state, action, target) {
		target = target == null ? this.net : this.target;
		target.forward(state);
		return target.out.w[action];
	}

	// replay
	optimize(e, descent = true) {
		var target = e.target();
		var value = e.estimate();

		var grad = value - target;
		var gradAL = grad + this.options.alpha * (value - this.agent.evaluate(e.state0, true)); // advantage learning
		var isw = this.buffer.getImportanceSamplingWeight(e);

		this.net.out.dw.fill(0.0);
		this.net.out.dw[e.action0] = gradAL * isw;

		if (descent) {
			this.net.backward();
			this.net.configuration.accumulate();
		}

		return gradAL * gradAL * 0.5;
	}

	// adjust weights etc
	learn() {
		this.net.configuration.optimize(false);
		this.targetUpdate();
	}

	targetUpdate() {
		if (this.options.theta < 1) {
			this.target.configuration.forEachParameter(this.targetWeightCopy);
		}
	}

	progressiveCopy(net, param, index) {
		var _theta = this.options.theta;
		for (var i = 0; i < param.w.length; i++) {
			param.w[i] = _theta * net.parameters[index].w[i] + (1.0 - _theta) * param.w[i];
		}
	}

	import(params) {
		if (params.length !== this.net.configuration.countOfParameters) return false;

		this.net.configuration.read(params);

		return true;
	}

	export() {
		return this.net.configuration.write();
	}

}

module.exports = DQN;

/***/ }),
/* 36 */
/***/ (function(module, exports) {

class Experience {

	constructor(agent) {
		this.agent = agent;
		this.learnSteps = 0;

		if (agent.options.type === 'sarsa') this.target = this.__sarsa_target;else this.target = this.__q_target;
	}

	__q_target() {
		return this.reward0 + this.agent.options.discount * this.agent.evaluate(this.state1, true); // this.agent.value(this.state1, this.agent.act(this.state1, true), true)
	}

	__sarsa_target() {
		return this.reward0 + this.agent.options.discount * this.agent.value(this.state1, this.action1, true);
	}

	estimate() {
		return this.value = this.agent.value(this.state0, this.action0);
	}

	step() {
		this.loss = this.agent.algorithm.optimize(this);

		this.learnSteps++;
		this.lastLearnedAt = this.agent.age;

		return this.loss;
	}

	init() {
		this.loss = this.agent.algorithm.optimize(this, false);
		this.atAge = this.agent.age;
	}

	get priority() {
		if (this.loss === undefined) return undefined;

		return Math.pow(this.loss, this.agent.options.beta || 0.5);
	}

}

module.exports = Experience;

/***/ }),
/* 37 */
/***/ (function(module, exports) {

class FileLoader {

	static download(file, callback) {
		// Create XHR, Blob and FileReader objects
		var xhr = new XMLHttpRequest(),
		    blob,
		    fileReader = new FileReader();

		xhr.open("GET", file, true);
		// Set the responseType to arraybuffer. "blob" is an option too, rendering manual Blob creation unnecessary, but the support for "blob" is not widespread enough yet
		xhr.responseType = "arraybuffer";

		xhr.addEventListener("load", function () {
			if (xhr.status === 200) {
				callback(null, xhr.response);
			} else {
				callback(xhr.status, null);
			}
		}, false);

		// Send XHR
		xhr.send();
	}

}

module.exports = FileLoader;

/***/ }),
/* 38 */
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(process) {function CheckSupport() {

	if (process !== undefined && !process.browser) {
		if (process.version.indexOf('v') !== 0) {
			throw 'unknown node version.';
		}

		var vn = process.version.substring(1).split('.');
		var major = parseInt(vn[0]);
		var minor = parseInt(vn[1]);

		if (major > 6) return true;
		if (major === 6 && minor >= 6) return true;

		return false;
	} else if (typeof window !== 'undefined') {
		var supported = {
			'safari': 10,
			'chrome': 54
		};

		return true;
	}

	return true;
}

module.exports = CheckSupport;
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(14)))

/***/ }),
/* 39 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


/*\
|*|
|*|	:: Number.isInteger() polyfill ::
|*|
|*|	https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number/isInteger
|*|
\*/

if (!Number.isInteger) {
	Number.isInteger = function isInteger(nVal) {
		return typeof nVal === "number" && isFinite(nVal) && nVal > -9007199254740992 && nVal < 9007199254740992 && Math.floor(nVal) === nVal;
	};
}

/*\
|*|
|*|	StringView - Mozilla Developer Network
|*|
|*|	Revision #9, October 30, 2016
|*|
|*|	https://developer.mozilla.org/en-US/Add-ons/Code_snippets/StringView
|*|	https://developer.mozilla.org/en-US/docs/User:fusionchess
|*|	https://github.com/madmurphy/stringview.js
|*|
|*|	This framework is released under the GNU Lesser General Public License, version 3 or later.
|*|	http://www.gnu.org/licenses/lgpl-3.0.html
|*|
\*/

function StringView(vInput, sEncoding /* optional (default: UTF-8) */, nOffset /* optional */, nLength /* optional */) {

	var fTAView,
	    aWhole,
	    aRaw,
	    fPutOutptCode,
	    fGetOutptChrSize,
	    nInptLen,
	    nStartIdx = isFinite(nOffset) ? nOffset : 0,
	    nTranscrType = 15;

	if (sEncoding) {
		this.encoding = sEncoding.toString();
	}

	encSwitch: switch (this.encoding) {
		case "UTF-8":
			fPutOutptCode = StringView.putUTF8CharCode;
			fGetOutptChrSize = StringView.getUTF8CharLength;
			fTAView = Uint8Array;
			break encSwitch;
		case "UTF-16":
			fPutOutptCode = StringView.putUTF16CharCode;
			fGetOutptChrSize = StringView.getUTF16CharLength;
			fTAView = Uint16Array;
			break encSwitch;
		case "UTF-32":
			fTAView = Uint32Array;
			nTranscrType &= 14;
			break encSwitch;
		default:
			/* case "ASCII", or case "BinaryString" or unknown cases */
			fTAView = Uint8Array;
			nTranscrType &= 14;
	}

	typeSwitch: switch (typeof vInput) {
		case "string":
			/* the input argument is a primitive string: a new buffer will be created. */
			nTranscrType &= 7;
			break typeSwitch;
		case "object":
			classSwitch: switch (vInput.constructor) {
				case StringView:
					/* the input argument is a stringView: a new buffer will be created. */
					nTranscrType &= 3;
					break typeSwitch;
				case String:
					/* the input argument is an objectified string: a new buffer will be created. */
					nTranscrType &= 7;
					break typeSwitch;
				case ArrayBuffer:
					/* the input argument is an arrayBuffer: the buffer will be shared. */
					aWhole = new fTAView(vInput);
					nInptLen = this.encoding === "UTF-32" ? vInput.byteLength >>> 2 : this.encoding === "UTF-16" ? vInput.byteLength >>> 1 : vInput.byteLength;
					aRaw = nStartIdx === 0 && (!isFinite(nLength) || nLength === nInptLen) ? aWhole : new fTAView(vInput, nStartIdx, !isFinite(nLength) ? nInptLen - nStartIdx : nLength);

					break typeSwitch;
				case Uint32Array:
				case Uint16Array:
				case Uint8Array:
					/* the input argument is a typedArray: the buffer, and possibly the array itself, will be shared. */
					fTAView = vInput.constructor;
					nInptLen = vInput.length;
					aWhole = vInput.byteOffset === 0 && vInput.length === (fTAView === Uint32Array ? vInput.buffer.byteLength >>> 2 : fTAView === Uint16Array ? vInput.buffer.byteLength >>> 1 : vInput.buffer.byteLength) ? vInput : new fTAView(vInput.buffer);
					aRaw = nStartIdx === 0 && (!isFinite(nLength) || nLength === nInptLen) ? vInput : vInput.subarray(nStartIdx, isFinite(nLength) ? nStartIdx + nLength : nInptLen);

					break typeSwitch;
				default:
					/* the input argument is an array or another serializable object: a new typedArray will be created. */
					aWhole = new fTAView(vInput);
					nInptLen = aWhole.length;
					aRaw = nStartIdx === 0 && (!isFinite(nLength) || nLength === nInptLen) ? aWhole : aWhole.subarray(nStartIdx, isFinite(nLength) ? nStartIdx + nLength : nInptLen);
			}
			break typeSwitch;
		default:
			/* the input argument is a number, a boolean or a function: a new typedArray will be created. */
			aWhole = aRaw = new fTAView(Number(vInput) || 0);

	}

	if (nTranscrType < 8) {

		var vSource, nOutptLen, nCharStart, nCharEnd, nEndIdx, fGetInptChrSize, fGetInptChrCode;

		if (nTranscrType & 4) {
			/* input is string */

			vSource = vInput;
			nOutptLen = nInptLen = vSource.length;
			nTranscrType ^= this.encoding === "UTF-32" ? 0 : 2;
			/* ...or...: nTranscrType ^= Number(this.encoding !== "UTF-32") << 1; */
			nStartIdx = nCharStart = nOffset ? Math.max((nOutptLen + nOffset) % nOutptLen, 0) : 0;
			nEndIdx = nCharEnd = (Number.isInteger(nLength) ? Math.min(Math.max(nLength, 0) + nStartIdx, nOutptLen) : nOutptLen) - 1;
		} else {
			/* input is stringView */

			vSource = vInput.rawData;
			nInptLen = vInput.makeIndex();
			nStartIdx = nCharStart = nOffset ? Math.max((nInptLen + nOffset) % nInptLen, 0) : 0;
			nOutptLen = Number.isInteger(nLength) ? Math.min(Math.max(nLength, 0), nInptLen - nCharStart) : nInptLen;
			nEndIdx = nCharEnd = nOutptLen + nCharStart;

			if (vInput.encoding === "UTF-8") {
				fGetInptChrSize = StringView.getUTF8CharLength;
				fGetInptChrCode = StringView.loadUTF8CharCode;
			} else if (vInput.encoding === "UTF-16") {
				fGetInptChrSize = StringView.getUTF16CharLength;
				fGetInptChrCode = StringView.loadUTF16CharCode;
			} else {
				nTranscrType &= 1;
			}
		}

		if (nOutptLen === 0 || nTranscrType < 4 && vSource.encoding === this.encoding && nCharStart === 0 && nOutptLen === nInptLen) {

			/* the encoding is the same, the length too and the offset is 0... or the input is empty! */

			nTranscrType = 7;
		}

		conversionSwitch: switch (nTranscrType) {

			case 0:

				/* both the source and the new StringView have a fixed-length encoding... */

				aWhole = new fTAView(nOutptLen);
				for (var nOutptIdx = 0; nOutptIdx < nOutptLen; aWhole[nOutptIdx] = vSource[nStartIdx + nOutptIdx++]);
				break conversionSwitch;

			case 1:

				/* the source has a fixed-length encoding but the new StringView has a variable-length encoding... */

				/* mapping... */

				nOutptLen = 0;

				for (var nInptIdx = nStartIdx; nInptIdx < nEndIdx; nInptIdx++) {
					nOutptLen += fGetOutptChrSize(vSource[nInptIdx]);
				}

				aWhole = new fTAView(nOutptLen);

				/* transcription of the source... */

				for (var nInptIdx = nStartIdx, nOutptIdx = 0; nOutptIdx < nOutptLen; nInptIdx++) {
					nOutptIdx = fPutOutptCode(aWhole, vSource[nInptIdx], nOutptIdx);
				}

				break conversionSwitch;

			case 2:

				/* the source has a variable-length encoding but the new StringView has a fixed-length encoding... */

				/* mapping... */

				nStartIdx = 0;

				var nChrCode;

				for (nChrIdx = 0; nChrIdx < nCharStart; nChrIdx++) {
					nChrCode = fGetInptChrCode(vSource, nStartIdx);
					nStartIdx += fGetInptChrSize(nChrCode);
				}

				aWhole = new fTAView(nOutptLen);

				/* transcription of the source... */

				for (var nInptIdx = nStartIdx, nOutptIdx = 0; nOutptIdx < nOutptLen; nInptIdx += fGetInptChrSize(nChrCode), nOutptIdx++) {
					nChrCode = fGetInptChrCode(vSource, nInptIdx);
					aWhole[nOutptIdx] = nChrCode;
				}

				break conversionSwitch;

			case 3:

				/* both the source and the new StringView have a variable-length encoding... */

				/* mapping... */

				nOutptLen = 0;

				var nChrCode;

				for (var nChrIdx = 0, nInptIdx = 0; nChrIdx < nCharEnd; nInptIdx += fGetInptChrSize(nChrCode)) {
					nChrCode = fGetInptChrCode(vSource, nInptIdx);
					if (nChrIdx === nCharStart) {
						nStartIdx = nInptIdx;
					}
					if (++nChrIdx > nCharStart) {
						nOutptLen += fGetOutptChrSize(nChrCode);
					}
				}

				aWhole = new fTAView(nOutptLen);

				/* transcription... */

				for (var nInptIdx = nStartIdx, nOutptIdx = 0; nOutptIdx < nOutptLen; nInptIdx += fGetInptChrSize(nChrCode)) {
					nChrCode = fGetInptChrCode(vSource, nInptIdx);
					nOutptIdx = fPutOutptCode(aWhole, nChrCode, nOutptIdx);
				}

				break conversionSwitch;

			case 4:

				/* DOMString to ASCII or BinaryString or other unknown encodings */

				aWhole = new fTAView(nOutptLen);

				/* transcription... */

				for (var nIdx = 0; nIdx < nOutptLen; nIdx++) {
					aWhole[nIdx] = vSource.charCodeAt(nIdx) & 0xff;
				}

				break conversionSwitch;

			case 5:

				/* DOMString to UTF-8 or to UTF-16 */

				/* mapping... */

				nOutptLen = 0;

				for (var nMapIdx = 0; nMapIdx < nInptLen; nMapIdx++) {
					if (nMapIdx === nCharStart) {
						nStartIdx = nOutptLen;
					}
					nOutptLen += fGetOutptChrSize(vSource.charCodeAt(nMapIdx));
					if (nMapIdx === nCharEnd) {
						nEndIdx = nOutptLen;
					}
				}

				aWhole = new fTAView(nOutptLen);

				/* transcription... */

				for (var nOutptIdx = 0, nChrIdx = 0; nOutptIdx < nOutptLen; nChrIdx++) {
					nOutptIdx = fPutOutptCode(aWhole, vSource.charCodeAt(nChrIdx), nOutptIdx);
				}

				break conversionSwitch;

			case 6:

				/* DOMString to UTF-32 */

				aWhole = new fTAView(nOutptLen);

				/* transcription... */

				for (var nIdx = 0; nIdx < nOutptLen; nIdx++) {
					aWhole[nIdx] = vSource.charCodeAt(nIdx);
				}

				break conversionSwitch;

			case 7:

				aWhole = new fTAView(nOutptLen ? vSource : 0);
				break conversionSwitch;

		}

		aRaw = nTranscrType > 3 && (nStartIdx > 0 || nEndIdx < aWhole.length - 1) ? aWhole.subarray(nStartIdx, nEndIdx) : aWhole;
	}

	this.buffer = aWhole.buffer;
	this.bufferView = aWhole;
	this.rawData = aRaw;

	Object.freeze(this);
}

/* CONSTRUCTOR'S METHODS */

StringView.loadUTF8CharCode = function (aChars, nIdx) {

	var nLen = aChars.length,
	    nPart = aChars[nIdx];

	return nPart > 251 && nPart < 254 && nIdx + 5 < nLen ?
	/* (nPart - 252 << 30) may be not safe in ECMAScript! So...: */
	/* six bytes */(nPart - 252) * 1073741824 + (aChars[nIdx + 1] - 128 << 24) + (aChars[nIdx + 2] - 128 << 18) + (aChars[nIdx + 3] - 128 << 12) + (aChars[nIdx + 4] - 128 << 6) + aChars[nIdx + 5] - 128 : nPart > 247 && nPart < 252 && nIdx + 4 < nLen ?
	/* five bytes */(nPart - 248 << 24) + (aChars[nIdx + 1] - 128 << 18) + (aChars[nIdx + 2] - 128 << 12) + (aChars[nIdx + 3] - 128 << 6) + aChars[nIdx + 4] - 128 : nPart > 239 && nPart < 248 && nIdx + 3 < nLen ?
	/* four bytes */(nPart - 240 << 18) + (aChars[nIdx + 1] - 128 << 12) + (aChars[nIdx + 2] - 128 << 6) + aChars[nIdx + 3] - 128 : nPart > 223 && nPart < 240 && nIdx + 2 < nLen ?
	/* three bytes */(nPart - 224 << 12) + (aChars[nIdx + 1] - 128 << 6) + aChars[nIdx + 2] - 128 : nPart > 191 && nPart < 224 && nIdx + 1 < nLen ?
	/* two bytes */(nPart - 192 << 6) + aChars[nIdx + 1] - 128 :
	/* one byte */nPart;
};

StringView.putUTF8CharCode = function (aTarget, nChar, nPutAt) {

	var nIdx = nPutAt;

	if (nChar < 0x80 /* 128 */) {
			/* one byte */
			aTarget[nIdx++] = nChar;
		} else if (nChar < 0x800 /* 2048 */) {
			/* two bytes */
			aTarget[nIdx++] = 0xc0 /* 192 */ + (nChar >>> 6);
			aTarget[nIdx++] = 0x80 /* 128 */ + (nChar & 0x3f /* 63 */);
		} else if (nChar < 0x10000 /* 65536 */) {
			/* three bytes */
			aTarget[nIdx++] = 0xe0 /* 224 */ + (nChar >>> 12);
			aTarget[nIdx++] = 0x80 /* 128 */ + (nChar >>> 6 & 0x3f /* 63 */);
			aTarget[nIdx++] = 0x80 /* 128 */ + (nChar & 0x3f /* 63 */);
		} else if (nChar < 0x200000 /* 2097152 */) {
			/* four bytes */
			aTarget[nIdx++] = 0xf0 /* 240 */ + (nChar >>> 18);
			aTarget[nIdx++] = 0x80 /* 128 */ + (nChar >>> 12 & 0x3f /* 63 */);
			aTarget[nIdx++] = 0x80 /* 128 */ + (nChar >>> 6 & 0x3f /* 63 */);
			aTarget[nIdx++] = 0x80 /* 128 */ + (nChar & 0x3f /* 63 */);
		} else if (nChar < 0x4000000 /* 67108864 */) {
			/* five bytes */
			aTarget[nIdx++] = 0xf8 /* 248 */ + (nChar >>> 24);
			aTarget[nIdx++] = 0x80 /* 128 */ + (nChar >>> 18 & 0x3f /* 63 */);
			aTarget[nIdx++] = 0x80 /* 128 */ + (nChar >>> 12 & 0x3f /* 63 */);
			aTarget[nIdx++] = 0x80 /* 128 */ + (nChar >>> 6 & 0x3f /* 63 */);
			aTarget[nIdx++] = 0x80 /* 128 */ + (nChar & 0x3f /* 63 */);
		} else /* if (nChar <= 0x7fffffff) */{
			/* 2147483647 */
			/* six bytes */
			aTarget[nIdx++] = 0xfc /* 252 */ + /* (nChar >>> 30) may be not safe in ECMAScript! So...: */nChar / 1073741824;
			aTarget[nIdx++] = 0x80 /* 128 */ + (nChar >>> 24 & 0x3f /* 63 */);
			aTarget[nIdx++] = 0x80 /* 128 */ + (nChar >>> 18 & 0x3f /* 63 */);
			aTarget[nIdx++] = 0x80 /* 128 */ + (nChar >>> 12 & 0x3f /* 63 */);
			aTarget[nIdx++] = 0x80 /* 128 */ + (nChar >>> 6 & 0x3f /* 63 */);
			aTarget[nIdx++] = 0x80 /* 128 */ + (nChar & 0x3f /* 63 */);
		}

	return nIdx;
};

StringView.getUTF8CharLength = function (nChar) {
	return nChar < 0x80 ? 1 : nChar < 0x800 ? 2 : nChar < 0x10000 ? 3 : nChar < 0x200000 ? 4 : nChar < 0x4000000 ? 5 : 6;
};

StringView.loadUTF16CharCode = function (aChars, nIdx) {

	/* UTF-16 to DOMString decoding algorithm */
	var nFrstChr = aChars[nIdx];

	return nFrstChr > 0xD7BF /* 55231 */ && nIdx + 1 < aChars.length ? (nFrstChr - 0xD800 /* 55296 */ << 10) + aChars[nIdx + 1] + 0x2400 /* 9216 */
	: nFrstChr;
};

StringView.putUTF16CharCode = function (aTarget, nChar, nPutAt) {

	var nIdx = nPutAt;

	if (nChar < 0x10000 /* 65536 */) {
			/* one element */
			aTarget[nIdx++] = nChar;
		} else {
		/* two elements */
		aTarget[nIdx++] = 0xD7C0 /* 55232 */ + (nChar >>> 10);
		aTarget[nIdx++] = 0xDC00 /* 56320 */ + (nChar & 0x3FF /* 1023 */);
	}

	return nIdx;
};

StringView.getUTF16CharLength = function (nChar) {
	return nChar < 0x10000 ? 1 : 2;
};

/* Array of bytes to base64 string decoding */

StringView.b64ToUint6 = function (nChr) {

	return nChr > 64 && nChr < 91 ? nChr - 65 : nChr > 96 && nChr < 123 ? nChr - 71 : nChr > 47 && nChr < 58 ? nChr + 4 : nChr === 43 ? 62 : nChr === 47 ? 63 : 0;
};

StringView.uint6ToB64 = function (nUint6) {

	return nUint6 < 26 ? nUint6 + 65 : nUint6 < 52 ? nUint6 + 71 : nUint6 < 62 ? nUint6 - 4 : nUint6 === 62 ? 43 : nUint6 === 63 ? 47 : 65;
};

/* Base64 string to array encoding */

StringView.bytesToBase64 = function (aBytes) {

	var eqLen = (3 - aBytes.length % 3) % 3,
	    sB64Enc = "";

	for (var nMod3, nLen = aBytes.length, nUint24 = 0, nIdx = 0; nIdx < nLen; nIdx++) {
		nMod3 = nIdx % 3;
		/* Uncomment the following line in order to split the output in lines 76-character long: */
		/*
  if (nIdx > 0 && (nIdx * 4 / 3) % 76 === 0) { sB64Enc += "\r\n"; }
  */
		nUint24 |= aBytes[nIdx] << (16 >>> nMod3 & 24);
		if (nMod3 === 2 || aBytes.length - nIdx === 1) {
			sB64Enc += String.fromCharCode(StringView.uint6ToB64(nUint24 >>> 18 & 63), StringView.uint6ToB64(nUint24 >>> 12 & 63), StringView.uint6ToB64(nUint24 >>> 6 & 63), StringView.uint6ToB64(nUint24 & 63));
			nUint24 = 0;
		}
	}

	return eqLen === 0 ? sB64Enc : sB64Enc.substring(0, sB64Enc.length - eqLen) + (eqLen === 1 ? "=" : "==");
};

StringView.base64ToBytes = function (sBase64, nBlockBytes) {

	var sB64Enc = sBase64.replace(/[^A-Za-z0-9\+\/]/g, ""),
	    nInLen = sB64Enc.length,
	    nOutLen = nBlockBytes ? Math.ceil((nInLen * 3 + 1 >>> 2) / nBlockBytes) * nBlockBytes : nInLen * 3 + 1 >>> 2,
	    aBytes = new Uint8Array(nOutLen);

	for (var nMod3, nMod4, nUint24 = 0, nOutIdx = 0, nInIdx = 0; nInIdx < nInLen; nInIdx++) {
		nMod4 = nInIdx & 3;
		nUint24 |= StringView.b64ToUint6(sB64Enc.charCodeAt(nInIdx)) << 18 - 6 * nMod4;
		if (nMod4 === 3 || nInLen - nInIdx === 1) {
			for (nMod3 = 0; nMod3 < 3 && nOutIdx < nOutLen; nMod3++, nOutIdx++) {
				aBytes[nOutIdx] = nUint24 >>> (16 >>> nMod3 & 24) & 255;
			}
			nUint24 = 0;
		}
	}

	return aBytes;
};

StringView.makeFromBase64 = function (sB64Inpt, sEncoding, nByteOffset, nLength) {

	return new StringView(sEncoding === "UTF-16" || sEncoding === "UTF-32" ? StringView.base64ToBytes(sB64Inpt, sEncoding === "UTF-16" ? 2 : 4).buffer : StringView.base64ToBytes(sB64Inpt), sEncoding, nByteOffset, nLength);
};

/* DEFAULT VALUES */

StringView.prototype.encoding = "UTF-8"; /* Default encoding... */

/* INSTANCES' METHODS */

StringView.prototype.makeIndex = function (nChrLength, nStartFrom) {

	var aTarget = this.rawData,
	    nChrEnd,
	    nRawLength = aTarget.length,
	    nStartIdx = nStartFrom || 0,
	    nIdxEnd = nStartIdx,
	    nStopAtChr = isNaN(nChrLength) ? Infinity : nChrLength;

	if (nChrLength + 1 > aTarget.length) {
		throw new RangeError("StringView.prototype.makeIndex - The offset can\'t be major than the length of the array - 1.");
	}

	switch (this.encoding) {

		case "UTF-8":

			var nPart;

			for (nChrEnd = 0; nIdxEnd < nRawLength && nChrEnd < nStopAtChr; nChrEnd++) {
				nPart = aTarget[nIdxEnd];
				nIdxEnd += nPart > 251 && nPart < 254 && nIdxEnd + 5 < nRawLength ? 6 : nPart > 247 && nPart < 252 && nIdxEnd + 4 < nRawLength ? 5 : nPart > 239 && nPart < 248 && nIdxEnd + 3 < nRawLength ? 4 : nPart > 223 && nPart < 240 && nIdxEnd + 2 < nRawLength ? 3 : nPart > 191 && nPart < 224 && nIdxEnd + 1 < nRawLength ? 2 : 1;
			}

			break;

		case "UTF-16":

			for (nChrEnd = nStartIdx; nIdxEnd < nRawLength && nChrEnd < nStopAtChr; nChrEnd++) {
				nIdxEnd += aTarget[nIdxEnd] > 0xD7BF /* 55231 */ && nIdxEnd + 1 < aTarget.length ? 2 : 1;
			}

			break;

		default:

			nIdxEnd = nChrEnd = isFinite(nChrLength) ? nChrLength : nRawLength - 1;

	}

	if (nChrLength) {
		return nIdxEnd;
	}

	return nChrEnd;
};

StringView.prototype.toBase64 = function (bWholeBuffer) {

	return StringView.bytesToBase64(bWholeBuffer ? this.bufferView.constructor === Uint8Array ? this.bufferView : new Uint8Array(this.buffer) : this.rawData.constructor === Uint8Array ? this.rawData : new Uint8Array(this.buffer, this.rawData.byteOffset, this.rawData.length << (this.rawData.constructor === Uint16Array ? 1 : 2)));
};

StringView.prototype.subview = function (nCharOffset /* optional */, nCharLength /* optional */) {

	var nChrLen,
	    nCharStart,
	    nStrLen,
	    bVariableLen = this.encoding === "UTF-8" || this.encoding === "UTF-16",
	    nStartOffset = nCharOffset,
	    nStringLength,
	    nRawLen = this.rawData.length;

	if (nRawLen === 0) {
		return new StringView(this.buffer, this.encoding);
	}

	nStringLength = bVariableLen ? this.makeIndex() : nRawLen;
	nCharStart = nCharOffset ? Math.max((nStringLength + nCharOffset) % nStringLength, 0) : 0;
	nStrLen = Number.isInteger(nCharLength) ? Math.max(nCharLength, 0) + nCharStart > nStringLength ? nStringLength - nCharStart : nCharLength : nStringLength;

	if (nCharStart === 0 && nStrLen === nStringLength) {
		return this;
	}

	if (bVariableLen) {
		nStartOffset = this.makeIndex(nCharStart);
		nChrLen = this.makeIndex(nStrLen, nStartOffset) - nStartOffset;
	} else {
		nStartOffset = nCharStart;
		nChrLen = nStrLen - nCharStart;
	}

	if (this.encoding === "UTF-16") {
		nStartOffset <<= 1;
	} else if (this.encoding === "UTF-32") {
		nStartOffset <<= 2;
	}

	return new StringView(this.buffer, this.encoding, nStartOffset, nChrLen);
};

StringView.prototype.forEachChar = function (fCallback, oThat, nChrOffset, nChrLen) {

	var aSource = this.rawData,
	    nRawEnd,
	    nRawIdx;

	if (this.encoding === "UTF-8" || this.encoding === "UTF-16") {

		var fGetInptChrSize, fGetInptChrCode;

		if (this.encoding === "UTF-8") {
			fGetInptChrSize = StringView.getUTF8CharLength;
			fGetInptChrCode = StringView.loadUTF8CharCode;
		} else if (this.encoding === "UTF-16") {
			fGetInptChrSize = StringView.getUTF16CharLength;
			fGetInptChrCode = StringView.loadUTF16CharCode;
		}

		nRawIdx = isFinite(nChrOffset) ? this.makeIndex(nChrOffset) : 0;
		nRawEnd = isFinite(nChrLen) ? this.makeIndex(nChrLen, nRawIdx) : aSource.length;

		for (var nChrCode, nChrIdx = 0; nRawIdx < nRawEnd; nChrIdx++) {
			nChrCode = fGetInptChrCode(aSource, nRawIdx);
			fCallback.call(oThat || null, nChrCode, nChrIdx, nRawIdx, aSource);
			nRawIdx += fGetInptChrSize(nChrCode);
		}
	} else {

		nRawIdx = isFinite(nChrOffset) ? nChrOffset : 0;
		nRawEnd = isFinite(nChrLen) ? nChrLen + nRawIdx : aSource.length;

		for (nRawIdx; nRawIdx < nRawEnd; nRawIdx++) {
			fCallback.call(oThat || null, aSource[nRawIdx], nRawIdx, nRawIdx, aSource);
		}
	}
};

StringView.prototype.valueOf = StringView.prototype.toString = function () {

	if (this.encoding !== "UTF-8" && this.encoding !== "UTF-16") {
		/* ASCII, UTF-32 or BinaryString to DOMString */
		return String.fromCharCode.apply(null, this.rawData);
	}

	var fGetCode,
	    fGetIncr,
	    sView = "";

	if (this.encoding === "UTF-8") {
		fGetIncr = StringView.getUTF8CharLength;
		fGetCode = StringView.loadUTF8CharCode;
	} else if (this.encoding === "UTF-16") {
		fGetIncr = StringView.getUTF16CharLength;
		fGetCode = StringView.loadUTF16CharCode;
	}

	for (var nChr, nLen = this.rawData.length, nIdx = 0; nIdx < nLen; nIdx += fGetIncr(nChr)) {
		nChr = fGetCode(this.rawData, nIdx);
		sView += String.fromCharCode(nChr);
	}

	return sView;
};

module.exports = StringView;

/***/ }),
/* 40 */
/***/ (function(module, exports) {

module['exports'] = function runTheTrap (text, options) {
  var result = "";
  text = text || "Run the trap, drop the bass";
  text = text.split('');
  var trap = {
    a: ["\u0040", "\u0104", "\u023a", "\u0245", "\u0394", "\u039b", "\u0414"],
    b: ["\u00df", "\u0181", "\u0243", "\u026e", "\u03b2", "\u0e3f"],
    c: ["\u00a9", "\u023b", "\u03fe"],
    d: ["\u00d0", "\u018a", "\u0500" , "\u0501" ,"\u0502", "\u0503"],
    e: ["\u00cb", "\u0115", "\u018e", "\u0258", "\u03a3", "\u03be", "\u04bc", "\u0a6c"],
    f: ["\u04fa"],
    g: ["\u0262"],
    h: ["\u0126", "\u0195", "\u04a2", "\u04ba", "\u04c7", "\u050a"],
    i: ["\u0f0f"],
    j: ["\u0134"],
    k: ["\u0138", "\u04a0", "\u04c3", "\u051e"],
    l: ["\u0139"],
    m: ["\u028d", "\u04cd", "\u04ce", "\u0520", "\u0521", "\u0d69"],
    n: ["\u00d1", "\u014b", "\u019d", "\u0376", "\u03a0", "\u048a"],
    o: ["\u00d8", "\u00f5", "\u00f8", "\u01fe", "\u0298", "\u047a", "\u05dd", "\u06dd", "\u0e4f"],
    p: ["\u01f7", "\u048e"],
    q: ["\u09cd"],
    r: ["\u00ae", "\u01a6", "\u0210", "\u024c", "\u0280", "\u042f"],
    s: ["\u00a7", "\u03de", "\u03df", "\u03e8"],
    t: ["\u0141", "\u0166", "\u0373"],
    u: ["\u01b1", "\u054d"],
    v: ["\u05d8"],
    w: ["\u0428", "\u0460", "\u047c", "\u0d70"],
    x: ["\u04b2", "\u04fe", "\u04fc", "\u04fd"],
    y: ["\u00a5", "\u04b0", "\u04cb"],
    z: ["\u01b5", "\u0240"]
  }
  text.forEach(function(c){
    c = c.toLowerCase();
    var chars = trap[c] || [" "];
    var rand = Math.floor(Math.random() * chars.length);
    if (typeof trap[c] !== "undefined") {
      result += trap[c][rand];
    } else {
      result += c;
    }
  });
  return result;

}


/***/ }),
/* 41 */
/***/ (function(module, exports) {

// please no
module['exports'] = function zalgo(text, options) {
  text = text || "   he is here   ";
  var soul = {
    "up" : [
      '̍', '̎', '̄', '̅',
      '̿', '̑', '̆', '̐',
      '͒', '͗', '͑', '̇',
      '̈', '̊', '͂', '̓',
      '̈', '͊', '͋', '͌',
      '̃', '̂', '̌', '͐',
      '̀', '́', '̋', '̏',
      '̒', '̓', '̔', '̽',
      '̉', 'ͣ', 'ͤ', 'ͥ',
      'ͦ', 'ͧ', 'ͨ', 'ͩ',
      'ͪ', 'ͫ', 'ͬ', 'ͭ',
      'ͮ', 'ͯ', '̾', '͛',
      '͆', '̚'
    ],
    "down" : [
      '̖', '̗', '̘', '̙',
      '̜', '̝', '̞', '̟',
      '̠', '̤', '̥', '̦',
      '̩', '̪', '̫', '̬',
      '̭', '̮', '̯', '̰',
      '̱', '̲', '̳', '̹',
      '̺', '̻', '̼', 'ͅ',
      '͇', '͈', '͉', '͍',
      '͎', '͓', '͔', '͕',
      '͖', '͙', '͚', '̣'
    ],
    "mid" : [
      '̕', '̛', '̀', '́',
      '͘', '̡', '̢', '̧',
      '̨', '̴', '̵', '̶',
      '͜', '͝', '͞',
      '͟', '͠', '͢', '̸',
      '̷', '͡', ' ҉'
    ]
  },
  all = [].concat(soul.up, soul.down, soul.mid),
  zalgo = {};

  function randomNumber(range) {
    var r = Math.floor(Math.random() * range);
    return r;
  }

  function is_char(character) {
    var bool = false;
    all.filter(function (i) {
      bool = (i === character);
    });
    return bool;
  }
  

  function heComes(text, options) {
    var result = '', counts, l;
    options = options || {};
    options["up"] =   typeof options["up"]   !== 'undefined' ? options["up"]   : true;
    options["mid"] =  typeof options["mid"]  !== 'undefined' ? options["mid"]  : true;
    options["down"] = typeof options["down"] !== 'undefined' ? options["down"] : true;
    options["size"] = typeof options["size"] !== 'undefined' ? options["size"] : "maxi";
    text = text.split('');
    for (l in text) {
      if (is_char(l)) {
        continue;
      }
      result = result + text[l];
      counts = {"up" : 0, "down" : 0, "mid" : 0};
      switch (options.size) {
      case 'mini':
        counts.up = randomNumber(8);
        counts.mid = randomNumber(2);
        counts.down = randomNumber(8);
        break;
      case 'maxi':
        counts.up = randomNumber(16) + 3;
        counts.mid = randomNumber(4) + 1;
        counts.down = randomNumber(64) + 3;
        break;
      default:
        counts.up = randomNumber(8) + 1;
        counts.mid = randomNumber(6) / 2;
        counts.down = randomNumber(8) + 1;
        break;
      }

      var arr = ["up", "mid", "down"];
      for (var d in arr) {
        var index = arr[d];
        for (var i = 0 ; i <= counts[index]; i++) {
          if (options[index]) {
            result = result + soul[index][randomNumber(soul[index].length)];
          }
        }
      }
    }
    return result;
  }
  // don't summon him
  return heComes(text, options);
}


/***/ }),
/* 42 */
/***/ (function(module, exports, __webpack_require__) {

var colors = __webpack_require__(0);

module['exports'] = function () {

  //
  // Extends prototype of native string object to allow for "foo".red syntax
  //
  var addProperty = function (color, func) {
    String.prototype.__defineGetter__(color, func);
  };

  var sequencer = function sequencer (map, str) {
      return function () {
        var exploded = this.split(""), i = 0;
        exploded = exploded.map(map);
        return exploded.join("");
      }
  };

  addProperty('strip', function () {
    return colors.strip(this);
  });

  addProperty('stripColors', function () {
    return colors.strip(this);
  });

  addProperty("trap", function(){
    return colors.trap(this);
  });

  addProperty("zalgo", function(){
    return colors.zalgo(this);
  });

  addProperty("zebra", function(){
    return colors.zebra(this);
  });

  addProperty("rainbow", function(){
    return colors.rainbow(this);
  });

  addProperty("random", function(){
    return colors.random(this);
  });

  addProperty("america", function(){
    return colors.america(this);
  });

  //
  // Iterate through all default styles and colors
  //
  var x = Object.keys(colors.styles);
  x.forEach(function (style) {
    addProperty(style, function () {
      return colors.stylize(this, style);
    });
  });

  function applyTheme(theme) {
    //
    // Remark: This is a list of methods that exist
    // on String that you should not overwrite.
    //
    var stringPrototypeBlacklist = [
      '__defineGetter__', '__defineSetter__', '__lookupGetter__', '__lookupSetter__', 'charAt', 'constructor',
      'hasOwnProperty', 'isPrototypeOf', 'propertyIsEnumerable', 'toLocaleString', 'toString', 'valueOf', 'charCodeAt',
      'indexOf', 'lastIndexof', 'length', 'localeCompare', 'match', 'replace', 'search', 'slice', 'split', 'substring',
      'toLocaleLowerCase', 'toLocaleUpperCase', 'toLowerCase', 'toUpperCase', 'trim', 'trimLeft', 'trimRight'
    ];

    Object.keys(theme).forEach(function (prop) {
      if (stringPrototypeBlacklist.indexOf(prop) !== -1) {
        console.log('warn: '.red + ('String.prototype' + prop).magenta + ' is probably something you don\'t want to override. Ignoring style name');
      }
      else {
        if (typeof(theme[prop]) === 'string') {
          colors[prop] = colors[theme[prop]];
          addProperty(prop, function () {
            return colors[theme[prop]](this);
          });
        }
        else {
          addProperty(prop, function () {
            var ret = this;
            for (var t = 0; t < theme[prop].length; t++) {
              ret = colors[theme[prop][t]](ret);
            }
            return ret;
          });
        }
      }
    });
  }

  colors.setTheme = function (theme) {
    if (typeof theme === 'string') {
      try {
        colors.themes[theme] = !(function webpackMissingModule() { var e = new Error("Cannot find module \".\""); e.code = 'MODULE_NOT_FOUND';; throw e; }());
        applyTheme(colors.themes[theme]);
        return colors.themes[theme];
      } catch (err) {
        console.log(err);
        return err;
      }
    } else {
      applyTheme(theme);
    }
  };

};

/***/ }),
/* 43 */
/***/ (function(module, exports, __webpack_require__) {

var colors = __webpack_require__(0);
module['exports'] = colors;

// Remark: By default, colors will add style properties to String.prototype
//
// If you don't wish to extend String.prototype you can do this instead and native String will not be touched
//
//   var colors = require('colors/safe);
//   colors.red("foo")
//
//
__webpack_require__(42)();

/***/ }),
/* 44 */
/***/ (function(module, exports, __webpack_require__) {

var colors = __webpack_require__(0);

module['exports'] = (function() {
  return function (letter, i, exploded) {
    if(letter === " ") return letter;
    switch(i%3) {
      case 0: return colors.red(letter);
      case 1: return colors.white(letter)
      case 2: return colors.blue(letter)
    }
  }
})();

/***/ }),
/* 45 */
/***/ (function(module, exports, __webpack_require__) {

var colors = __webpack_require__(0);

module['exports'] = (function () {
  var rainbowColors = ['red', 'yellow', 'green', 'blue', 'magenta']; //RoY G BiV
  return function (letter, i, exploded) {
    if (letter === " ") {
      return letter;
    } else {
      return colors[rainbowColors[i++ % rainbowColors.length]](letter);
    }
  };
})();



/***/ }),
/* 46 */
/***/ (function(module, exports, __webpack_require__) {

var colors = __webpack_require__(0);

module['exports'] = (function () {
  var available = ['underline', 'inverse', 'grey', 'yellow', 'red', 'green', 'blue', 'white', 'cyan', 'magenta'];
  return function(letter, i, exploded) {
    return letter === " " ? letter : colors[available[Math.round(Math.random() * (available.length - 1))]](letter);
  };
})();

/***/ }),
/* 47 */
/***/ (function(module, exports, __webpack_require__) {

var colors = __webpack_require__(0);

module['exports'] = function (letter, i, exploded) {
  return i % 2 === 0 ? letter : colors.inverse(letter);
};

/***/ }),
/* 48 */
/***/ (function(module, exports) {

/*
The MIT License (MIT)

Copyright (c) Sindre Sorhus <sindresorhus@gmail.com> (sindresorhus.com)

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.

*/

var styles = {};
module['exports'] = styles;

var codes = {
  reset: [0, 0],

  bold: [1, 22],
  dim: [2, 22],
  italic: [3, 23],
  underline: [4, 24],
  inverse: [7, 27],
  hidden: [8, 28],
  strikethrough: [9, 29],

  black: [30, 39],
  red: [31, 39],
  green: [32, 39],
  yellow: [33, 39],
  blue: [34, 39],
  magenta: [35, 39],
  cyan: [36, 39],
  white: [37, 39],
  gray: [90, 39],
  grey: [90, 39],

  bgBlack: [40, 49],
  bgRed: [41, 49],
  bgGreen: [42, 49],
  bgYellow: [43, 49],
  bgBlue: [44, 49],
  bgMagenta: [45, 49],
  bgCyan: [46, 49],
  bgWhite: [47, 49],

  // legacy styles for colors pre v1.0.0
  blackBG: [40, 49],
  redBG: [41, 49],
  greenBG: [42, 49],
  yellowBG: [43, 49],
  blueBG: [44, 49],
  magentaBG: [45, 49],
  cyanBG: [46, 49],
  whiteBG: [47, 49]

};

Object.keys(codes).forEach(function (key) {
  var val = codes[key];
  var style = styles[key] = [];
  style.open = '\u001b[' + val[0] + 'm';
  style.close = '\u001b[' + val[1] + 'm';
});

/***/ }),
/* 49 */
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(process) {/*
The MIT License (MIT)

Copyright (c) Sindre Sorhus <sindresorhus@gmail.com> (sindresorhus.com)

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.

*/

var argv = process.argv;

module.exports = (function () {
  if (argv.indexOf('--no-color') !== -1 ||
    argv.indexOf('--color=false') !== -1) {
    return false;
  }

  if (argv.indexOf('--color') !== -1 ||
    argv.indexOf('--color=true') !== -1 ||
    argv.indexOf('--color=always') !== -1) {
    return true;
  }

  if (process.stdout && !process.stdout.isTTY) {
    return false;
  }

  if (process.platform === 'win32') {
    return true;
  }

  if ('COLORTERM' in process.env) {
    return true;
  }

  if (process.env.TERM === 'dumb') {
    return false;
  }

  if (/^screen|^xterm|^vt100|color|ansi|cygwin|linux/i.test(process.env.TERM)) {
    return true;
  }

  return false;
})();
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(14)))

/***/ }),
/* 50 */
/***/ (function(module, exports) {

var g;

// This works in non-strict mode
g = (function() {
	return this;
})();

try {
	// This works if eval is allowed (see CSP)
	g = g || Function("return this")() || (1,eval)("this");
} catch(e) {
	// This works if the window reference is available
	if(typeof window === "object")
		g = window;
}

// g can still be undefined, but nothing to do about it...
// We return undefined, instead of nothing here, so it's
// easier to handle this case. if(!global) { ...}

module.exports = g;


/***/ }),
/* 51 */
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(16);
module.exports = __webpack_require__(15);


/***/ })
/******/ ]);