var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var path = require('path');
var mysql = require('mysql');

var pool = mysql.createPool({
    connectionLimit: 10, 
    host: 'localhost',
    user: 'chirpUser',
    password: 'chirp12678',
    database: 'Chirper'
});

var app = express();

app.use(express.static('client'));
app.use(bodyParser.json());

app.get('/chirps/*', function(req, res) {
    res.sendFile(path.join(__dirname,'../client', 'single_chirp.html'));
    });



    app.get('/api/chirps', function(req, res) {
        getStoredChirps()
            .then(function(chirps) {
                res.send(chirps);
            }, function(err) {
                res.status(500).send(err);
            });
    });

    app.get('/api/chirps/:id', function(req, res) {
        getStoredChirp(id)
            .then(function(oneChirp) {
                res.send(oneChirp);
            }, function(err) {
                res.status(500).send(err);
            });
    });

    app.get('/api/users', function(req, res) {
        getUsers()
            .then(function(users) {
                res.send(users);
            }, function(err) {
                res.status(500).send(err);
            });
    });

    app.post('/api/chirps', function(req, res) {
            var chirp = req.body;
                insertChirp(chirp.message, chirp.userId)
                .then(function(id) {
                    res.send(id);
                }, function(err) {
                    res.status(201).send(err);      
                });
    });

    app.put('/api/chirps', function(req, res) {
            var chirp = req.body;
                putChirp(chirp.id, chirp.message)
                .then(function(id) {
                    res.send(id);
                }, function(err) {
                    res.status(204).send(err);      
                });
    });
    
     app.delete('/api/chirps/:id', function(req, res) {
            var chirp = req.params;
                deleteChirp(chirp.id)
                .then(function() {
                    res.sendStatus(204);
                }, function(err) {
                    res.status(500).send(err);      
                });
    });

app.listen(3000);

   function getStoredChirps() {
          return new Promise(function(resolve, reject){
                pool.getConnection(function(err, connection) {
                    if (err) {
                        reject(err);
                    } else {
                        connection.query('CALL get_chirps();', function(err, allChirps) {
                            if (err) {
                                connection.release();
                                reject(err);
                            } else {
                                connection.release();
                                var results = allChirps[0];
                                resolve(results);
                            }
                        });
                    }
                });
            });
        }               

    function getStoredChirp(pId) {
        return new Promise(function(resolve, reject){
                pool.getConnection(function(err, connection) {
                    if (err) {
                        reject(err);
                    } else {
                        connection.query('CALL get_chirp(?);', [id], function(err, oneChirp) {
                            if (err) {
                                connection.release();
                                reject(err);
                            } else {
                                connection.release();
                                var results = oneChirp[id];
                                resolve(results[id]);
                            }
                        });
                    }
                });
            });
        }  

    function insertChirp(pMessage, pUser) {
            return new Promise(function(resolve, reject){
                pool.getConnection(function(err, connection) {
                    if (err) {
                        reject(err);
                    } else {
                        connection.query('CALL insert_chirp(?,?);', [pMessage, pUser], function(err, resultsets) {
                            if (err) {
                                connection.release();
                                reject(err);
                            } else {
                                connection.release();
                                var results = resultsets[0];
                                resolve(results[0]);
                            }
                        });
                    }
                });
            });
        }
        
    function putChirp(pId, pMessage) {
            return new Promise(function(resolve, reject){
                pool.getConnection(function(err, connection) {
                    if (err) {
                        reject(err);
                    } else {
                        connection.query('CALL update_chirp(?,?);', [pId, pMessage], function(err, resultsets) {
                            if (err) {
                                connection.release();
                                reject(err);
                            } else {
                                connection.release();
                                var results = resultsets[0];
                                resolve(results[0]);
                                
                            }
                        });
                    }
                });
            });
        }

    function deleteChirp(pId) {
            return new Promise(function(resolve, reject){
                    pool.getConnection(function(err, connection) {
                        if (err) {
                            reject(err);
                        } else {
                            connection.query('CALL delete_chirp(?);', [pId], function(err, deletedchirps) {
                                if (err) {
                                    connection.release();
                                    reject(err);
                                } else {
                                    connection.release();
                                    resolve(); 
                                }
                            });
                        }
                    });
                });
            }

        function getUsers() {
          return new Promise(function(resolve, reject){
                pool.getConnection(function(err, connection) {
                    if (err) {
                        reject(err);
                    } else {
                        connection.query('CALL GetUsers();', function(err, allUsers) {
                            if (err) {
                                connection.release();
                                reject(err);
                            } else {
                                connection.release();
                                var results = allUsers[0];
                                resolve(results);
                            }
                        });
                    }
                });
            });
        }               
























//  in the app.get put in (get_chirps);
//     function row(procName, args) {
//         return callProcedure(procName, args) 
//             .then(function(resultsets) {
//                 return resultsets[0];
//             })
//         }
    



//     function rows(procName, args) {
//         return callProcedure(procName, args)
//         .then(function(resultsets) {
//             return resultsets[0];
//         });
//     }     

    
//    function callProcedure(procName, args) {
//        if (!args) {
//            args = [];
//        } 
//        var argStream = '';
//        for (var i = 0; i < args.length; i++) {
//            if (i === args.length - 1) {
//                argString += '?';
//            } else {
//                argString += '?,';
//            }
//        }
//    } 
//          return new Promise(function(resolve, reject) {
//              pool.getConnection(function(err, connection) {
//                  if (err) {
//                      reject(err);
//                  } else {
//                      connection.query('CALL ' + procName+ '(' + argString + ');', args, function(err, resultsets) {
//                          connection.release();
//                          if (err) {
//                              reject(err);
//                          } else {
//                              resolve(resultsets);
//                          }
//                      });
//                  }
//              });
//          }); 
 
