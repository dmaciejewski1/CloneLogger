/*******************************************************************************
FILE: CloneLogger
PATH: /lib/CloneLogger.js
WHAT: An add-on to the CloneEngine module that outputs messaages into a database
      table. Has functions to look for existing log tables (by name) and either
      drop or create or them, to ultimately insert (CloneEngine) output into
      them with minimal database hassle.
*******************************************************************************/
"use strict";
var oracledb = require('oracledb');

//log table default names (if none are set)
const ACTIVITY_LOG = 'CE_ACTIVITY_LOG'; // units/steps of an operation
const OPERATION_LOG = 'CE_OPERATION_LOG'; // operation activity summary

//------------------------------------------------------------------------------
function CloneLogger(
  database,
  {activityLog,operationLog} = {activityLog:ACTIVITY_LOG,operationLog:OPERATION_LOG}
  ){

  let dbName = 'none',
      dbMake = 'none',
      dbUser,
      dbPassword,
      dbHost,
      dbPort,
      dbService;

  for (var key in database) {
    if (database.hasOwnProperty(key)) {
      if (key === 'user'){dbUser = database[key];}
      if (key === 'password'){dbPassword = database[key];}
      if (key === 'name'){dbName = database[key];}
      if (key === 'make'){dbMake = database[key];}
      if (key === 'host'){dbHost = database[key];}
      if (key === 'port'){dbPort = database[key];}
      if (key === 'service'){dbService = database[key];}
      if (key === 'sid'){dbService = database[key];}
      if (key === 'SID'){dbService = database[key];}
    }
  }
  this.passThruObj = {};
  Object.assign(this.passThruObj,{
    'Db'                  : dbMake === 'oracle' || dbMake === 'none' ? (dbName === 'none' ? dbUser : dbName) : dbName,
    'user'                : dbUser,
    'password'            : dbPassword,
    'connectString'       : dbMake === 'oracle' || dbMake === 'none' ? dbHost+':'+dbPort+'/'+dbService : (dbMake === 'postgres' ? 'postgres://'+dbUser+':'+dbPassword+'@'+dbHost+'/'+dbName : '\nERROR: cannot resolve connection string'),
    'activityLog'         : activityLog,
    'operationLog'        : operationLog
  });
}

//detect if an activity log table exists-------
//*<----SWITCH OFF-----
CloneLogger.prototype.detectActivityLog = function(){
  let passThruObj = this.passThruObj,
      tblName = passThruObj.activityLog,
      sqlStr = "SELECT CASE WHEN tableexists = 1 THEN \'true\' ELSE \'false\' END AS tableexists FROM (SELECT COUNT(rownum) AS tableexists FROM user_all_tables WHERE table_name = \'"+tblName+"\')";
  return new Promise(function(resolve, reject){
    oracledb.getConnection(
      {'user' : passThruObj.user,
       'password' : passThruObj.password,
       'connectString' : passThruObj.connectString
      },
      function(err, connection){
        if (err) {reject(err);}
        connection.execute(
          sqlStr,
          [],
          {outFormat : oracledb.OBJECT},
          function(err,response){
            if(err){
              if(err.toString() === 'Error: ORA-00942: table or view does not exist\n'){
                connection.release(function(conErr){reject(conErr);return;});
                resolve(false);
                return;
              }else{
                connection.release(function(connErr){reject(connErr);return;});
                reject(err);
                return;
              }
            }
            if(response.rows[0]['TABLEEXISTS'] === 'true' ) {
              connection.release(function(conErr){reject(conErr);return;});
              resolve(true);
              return;
            }else{
              connection.release(function(conErr){reject(conErr);return;});
              resolve(false);
              return;
            }
          }
        )
      }
    );
 })
}
//*/

//detect if an operation log table exists-------
//*<----SWITCH OFF-----
CloneLogger.prototype.detectOperationLog = function(){
  let passThruObj = this.passThruObj,
      tblName = passThruObj.operationLog,
      sqlStr = "SELECT CASE WHEN tableexists = 1 THEN \'true\' ELSE \'false\' END AS tableexists FROM (SELECT COUNT(rownum) AS tableexists FROM user_all_tables WHERE table_name = \'"+tblName+"\')";
  return new Promise(function(resolve, reject){
    oracledb.getConnection(
      {'user' : passThruObj.user,
       'password' : passThruObj.password,
       'connectString' : passThruObj.connectString
      },
      function(err, connection){
        if (err) {reject(err);}
        connection.execute(
          sqlStr,
          [],
          {outFormat : oracledb.OBJECT},
          function(err,response){
            if(err){
              if(err.toString() === 'Error: ORA-00942: table or view does not exist\n'){
                connection.release(function(conErr){reject(conErr);return;});
                resolve(false);
                return;
              }else{
                connection.release(function(connErr){reject(connErr);return;});
                reject(err);
                return;
              }
            }
            if(response.rows[0]['TABLEEXISTS'] === 'true' ) {
              connection.release(function(conErr){reject(conErr);return;});
              resolve(true);
              return;
            }else{
              connection.release(function(conErr){reject(conErr);return;});
              resolve(false);
              return;
            }
          }
        )
      }
    );
 })
}
//*/

//create an activity log table--------
//*<----SWITCH OFF-----
CloneLogger.prototype.createActivityLog = function(){
  let passThruObj = this.passThruObj,
      tblName = passThruObj.activityLog,
      sqlStr = 'CREATE TABLE '+tblName+' (activityid VARCHAR2(12 BYTE), operationid VARCHAR2(12 BYTE), step NUMBER, steptype VARCHAR2(20 BYTE), description VARCHAR2(200 BYTE), runon VARCHAR2(29 BYTE))';
  return new Promise(function(resolve, reject){
    oracledb.getConnection(
      {'user' : passThruObj.user,
       'password' : passThruObj.password,
       'connectString' : passThruObj.connectString
      },
      function(err, connection){
        if (err) {reject(err);}
        connection.execute(
          sqlStr,
          [],
          {outFormat : oracledb.OBJECT},
          function(err,response){
            if(err){
              if(err.toString() === 'Error: ORA-00955: name is already used by an existing object\n'){
                connection.release(function(conErr){reject(conErr);return;});
                resolve(false);
                return;
              }else{
                connection.release(function(connErr){reject(connErr);return;});
                reject(err);
                return;
              }
            }
            if(response.rowsAffected === 0 ) {
              connection.release(function(conErr){reject(conErr);return;});
              resolve(true);
              return;
            }else{
              connection.release(function(conErr){reject(conErr);return;});
              resolve(false);
              return;
            }
          }
        )
      }
    );
  })
}
//*/

//create an operation log table--------
//*<----SWITCH OFF-----
CloneLogger.prototype.createOperationLog = function(){
  let passThruObj = this.passThruObj,
      tblName = passThruObj.operationLog,
      sqlStr = 'CREATE TABLE '+tblName+' (operationID VARCHAR2(12 BYTE), operation VARCHAR2(100 BYTE), description VARCHAR2(200 BYTE), operationstarted VARCHAR2(29 BYTE), operationfinished VARCHAR2(29 BYTE), rowsparsed NUMBER, rowsloaded NUMBER, rowsmatch VARCHAR2(3 BYTE), bytescloned NUMBER, secondstaken NUMBER, sourcedb VARCHAR2(100 BYTE), sourcedbmake VARCHAR2(30 BYTE), sourcetable VARCHAR2(30 BYTE), destinationdb VARCHAR2(30 BYTE), destinationdbmake VARCHAR2(30 BYTE), destinationtable VARCHAR2(30 BYTE), destinationtblcreated VARCHAR2(29 BYTE), hostsystem VARCHAR2(50 BYTE))';
  return new Promise(function(resolve, reject){
    oracledb.getConnection(
      {'user' : passThruObj.user,
       'password' : passThruObj.password,
       'connectString' : passThruObj.connectString
      },
      function(err, connection){
        if (err) {reject(err);}
        connection.execute(
          sqlStr,
          [],
          {outFormat : oracledb.OBJECT},
          function(err,response){
            if(err){
              if(err.toString() === 'Error: ORA-00955: name is already used by an existing object\n'){
                connection.release(function(conErr){reject(conErr);return;});
                resolve(false);
                return;
              }else{
                connection.release(function(connErr){reject(connErr);return;});
                reject(err);
                return;
              }
            }
            if(response.rowsAffected === 0 ) {
              connection.release(function(conErr){reject(conErr);return;});
              resolve(true);
              return;
            }else{
              connection.release(function(conErr){reject(conErr);return;});
              resolve(false);
              return;
            }
          }
        )
      }
    );
  })
}
//*/

//drop activity log table-------
//*<----SWITCH OFF-----
CloneLogger.prototype.dropActivityLog = function(){
  let passThruObj = this.passThruObj,
      tblName = passThruObj.activityLog,
      sqlStr = 'DROP TABLE '+tblName+' CASCADE CONSTRAINTS PURGE';
  return new Promise(function(resolve, reject){
    oracledb.getConnection(
      {'user' : passThruObj.user,
       'password' : passThruObj.password,
       'connectString' : passThruObj.connectString
      },
      function(err, connection){
        if (err) {reject(err);}
        connection.execute(
          sqlStr,
          [],
          {outFormat : oracledb.OBJECT},
          function(err,response){
            if(err){
              if(err.toString() === 'Error: ORA-00942: table or view does not exist\n'){
                connection.release(function(conErr){reject(conErr);return;});
                resolve(false);
                return;
              }else{
                connection.release(function(connErr){reject(connErr);return;});
                reject(err);
                return;
              }
            }
            if(response.rowsAffected === 0 ) {
              connection.release(function(conErr){reject(conErr);return;});
              resolve(true);
              return;
            }else{
              connection.release(function(conErr){reject(conErr);return;});
              resolve(false);
              return;
            }
          }
        )
      }
    );
  })
}
//*/

//drop operation log table-------
//*<----SWITCH OFF-----
CloneLogger.prototype.dropOperationLog = function(){
  let passThruObj = this.passThruObj,
      tblName = passThruObj.operationLog,
      sqlStr = 'DROP TABLE '+tblName+' CASCADE CONSTRAINTS PURGE';
  return new Promise(function(resolve, reject){
    oracledb.getConnection(
      {'user' : passThruObj.user,
       'password' : passThruObj.password,
       'connectString' : passThruObj.connectString
      },
      function(err, connection){
        if (err) {reject(err);}
        connection.execute(
          sqlStr,
          [],
          {outFormat : oracledb.OBJECT},
          function(err,response){
            if(err){
              if(err.toString() === 'Error: ORA-00942: table or view does not exist\n'){
                connection.release(function(conErr){reject(conErr);return;});
                resolve(false);
                return;
              }else{
                connection.release(function(connErr){reject(connErr);return;});
                reject(err);
                return;
              }
            }
            if(response.rowsAffected === 0 ) {
              connection.release(function(conErr){reject(conErr);return;});
              resolve(true);
              return;
            }else{
              connection.release(function(conErr){reject(conErr);return;});
              resolve(false);
              return;
            }
          }
        )
      }
    );
  })
}
//*/

//insert log entries into log table
//*<----SWITCH OFF-----
CloneLogger.prototype.insert = function(msg){
  let passThruObj = this.passThruObj;
  if (msg.msgType === 'operation'){
    let tblName = passThruObj.operationLog,
        sqlStr = "INSERT INTO "+tblName+" (operationID, operation, description, operationstarted, operationfinished, rowsparsed, rowsloaded, rowsmatch, bytescloned, secondstaken, sourcedb, sourcedbmake, sourcetable, destinationdb, destinationdbmake, destinationtable, destinationtblcreated, hostsystem) VALUES (\'"+msg.operationId+"\', \'"+msg.operation+"\', \'"+msg.description+"\', \'"+msg.startTime+"\', \'"+msg.endTime+"\', \'"+msg.sourceDb.rows+"\', \'"+msg.destinationDb.rows+"\', \'"+msg.rowCountsMatch+"\', \'"+msg.bytesCloned+"\', \'"+msg.secondsTaken+"\', \'"+msg.sourceDb.name.toUpperCase()+"\', \'"+msg.sourceDb.make.toLowerCase()+"\', \'"+msg.sourceDb.table.toUpperCase()+"\', \'"+msg.destinationDb.name.toUpperCase()+"\', \'"+msg.destinationDb.make.toLowerCase()+"\', \'"+msg.destinationDb.table.toUpperCase()+"\', \'"+msg.destinationDb.created+"\', \'"+msg.hostSystem+"\')";
    return new Promise(function(resolve, reject){
      oracledb.getConnection(
        {'user' : passThruObj.user,
         'password' : passThruObj.password,
         'connectString' : passThruObj.connectString
        },
        function(err, connection){
          if (err) {reject(err);}
          connection.execute(
            sqlStr,
            [],
            {outFormat  : oracledb.OBJECT,
             autoCommit : true
            },
            function(err,response){
              if(err){
                if(err.toString() === 'Error: ORA-00942: table or view does not exist\n'){
                  connection.release(function(conErr){reject(conErr);return;});
                  resolve(false);
                  return;
                }else{
                  connection.release(function(connErr){reject(connErr);return;});
                  reject(err);
                  return;
                }
              }
              if(response.rowsAffected === 1 ) {
                connection.release(function(conErr){reject(conErr);return;});
                resolve(true);
                return;
              }else{
                connection.release(function(conErr){reject(conErr);return;});
                resolve(false);
                return;
              }
            }
          )
        }
      );
    })
  }else{
    let tblName = passThruObj.activityLog,
        sqlStr = "INSERT INTO "+tblName+" (activityid, operationid, step, steptype, description, runon) VALUES (\'"+msg.activityId+"\', \'"+msg.operationId+"\', "+msg.step+", \'"+msg.msgType+"\', \'"+msg.description+"\', \'"+msg.time+"\')";
    return new Promise(function(resolve, reject){
      oracledb.getConnection(
        {'user' : passThruObj.user,
         'password' : passThruObj.password,
         'connectString' : passThruObj.connectString
        },
        function(err, connection){
          if (err) {reject(err);}
          connection.execute(
            sqlStr,
            [],
            {outFormat  : oracledb.OBJECT,
             autoCommit : true
            },
            function(err,response){
              if(err){
                if(err.toString() === 'Error: ORA-00942: table or view does not exist\n'){
                  connection.release(function(conErr){reject(conErr);return;});
                  resolve(false);
                  return;
                }else{
                  connection.release(function(connErr){reject(connErr);return;});
                  reject(err);
                  return;
                }
              }
              if(response.rowsAffected === 1 ) {
                connection.release(function(conErr){reject(conErr);return;});
                resolve(true);
                return;
              }else{
                connection.release(function(conErr){reject(conErr);return;});
                resolve(false);
                return;
              }
            }
          )
        }
      );
    })
  }

}

//*/


module.exports = CloneLogger;
