# CloneLogger
Create and Maintain Log Tables for the CloneEngine Module

### Summary:
An add-on library that will create both Activity and Operation log tables within an Oracle Database environment for the CloneEngine Module. CloneLogger was designed to easily capture emitted messages from CloneEngine into specified log tables. This library has functions to look for existing log tables (by name) and either drop or create or them, to ultimately insert (CloneEngine) output to them with minimal database hassle.

### Requirements:
  - Oracle Instant Client installed and configured on local machine
  - Access to an Oracle Schema with read/write/drop permissions

### Quick Start:
#### A. Oracle Instant Client Download
  - Download the following **TWO** Oracle Instant Client Packages (here: http://www.oracle.com/technetwork/database/features/instant-client/index-097480.html ). Please make sure to download the correct packages for your system architecture (i.e. 64 bit vs 32 bit)

      * **Instant Client Package - Basic or Basic Lite**: Contains files required to run OCI, OCCI, and JDBC-OCI applications

      * **Instant Client Package - SDK**: Contains additional header files and an example makefile for developing Oracle applications with Instant Client


  #### B. Oracle Instant Client Installation and Configuration (this example procedure is for Mac OS X 64bit ONLY)
  From a terminal window:

  1) Unzip your Oracle Instant Client files to ```~/oracle```
  ```bash
  unzip instantclient-basic-macos.x64-12.1.0.2.0.zip -d ~/oracle
  unzip instantclient-sdk-macos.x64-12.1.0.2.0.zip -d ~/oracle
  ```
  2) Update your .bashrc file by appending and saving the following block of code:
  ```bash
  ##### Oracle Instant Client 12.1 #####
  export OCI_HOME=~/oracle/instantclient_12_1
  export OCI_LIB_DIR=$OCI_HOME
  export OCI_INC_DIR=$OCI_HOME/sdk/include
  export OCI_INCLUDE_DIR=$OCI_HOME/sdk/include
  export DYLD_LIBRARY_PATH=$OCI_LIB_DIR
  ```
  3) Create the following symbolic links from within your Instant Client directory (e.g. /oracle/instantclient_12_1):
  ```bash
  ln -s ~/oracle/instantclient_12_1/libclntsh.dylib.12.1 ~/oracle/instantclient_12_1/libclntsh.dylib
  ln -s ~/oracle/instantclient_12_1/libocci.dylib.12.1 ~/oracle/instantclient_12_1/libocci.dylib
  ```
  4) Restart your Terminal application OR type the following ```source ~/.bashrc```

  #### C. CloneLogger Installation
  ```
  npm install clonelogger
  ```

  #### D. Run CloneEngine Operations
  ```js
  "use strict";
  var CloneEngine = require('cloneengine');
  var CloneLogger = require('clonelogger');
  //////////////////////////////// CONFIGURE CLONE OPERATION CONFIGURATION //////////////////////////////

  //----Source Database Connection Setup----
  const SOURCE_DB = {
    dbMake          : 'postgres',
    database        : 'myPostgresDb',
    user            : 'me',
    password        : 'myPassWord',
    host            : 'my.db.com'
        };


  //----Destination Database Connection Setup----
  const DESTINATION_DB = {// must have read, write, delete permissions
    dbMake          : 'oracle',
    database        : 'myOracleDb',
    user            : 'me',
    password        : 'myPassWord',
    host            : 'myother.db.com',
    port            : 12345,
    service         : 'myother.db.com'
        };


  //----configure CloneEngine----
  const OVERWRITE_FOR_ALL_OPS = 'yes'; // allows CloneEngine to delete existing (Destination Db) table and replaces with new one
  const TIMEZONE = 'local'; // uses ISO Standard Timestamp... choose either 'utc' or 'local'
  const DISPLAY_MESSAGES_ON_CONSOLE = 'yes'; // configures CloneEngine messages to display on console
  const RUN_TYPE = 'sync'; // choose to run operations either "sync" (synchronously) or "async" (asynchronously)
  const STOP_ON_ERROR = 'yes'; // when running synchronously... upon an error: if 'yes' is selected, no further operations will be run

  //---configure CloneLogger----
  const LOG_OUTPUT = 'yes';
  const LOG_OUTPUT_TO = DESTINATION_DB; // configure where (i.e. the database) to store CloneLogger message outputs
  const ACTIVITY_LOG = 'clone_activities';//  name for the activity log (table that contains operation activity specific information)
  const OPERATION_LOG = 'clone_operations';// name for the operation log (table that contains operation summary specific information)


  ///////////////////////////////// CLONEENGINE AND CLONELOGGER LOGIC ///////////////////////////////

  //------------Initialize a CloneLogger function---------
  //set CloneEngine output to Destination Database
  var logger = new CloneLogger(LOG_OUTPUT_TO,
    {'activityLog'  : ACTIVITY_LOG,
     'operationLog' : OPERATION_LOG
    }
   );

  if (LOG_OUTPUT === 'yes'){
    //--------------Scan for existing log tables------------
    //check if Activity Log exists, if not, create one...
    logger.detectActivityLog()
      .then(function(response){
        if(response=== false){
          logger.createActivityLog();
        }
      })
      .catch(function(err){
        console.log(err);
      })

    //check if Operation Log exists, if not, create one...
    logger.detectOperationLog()
      .then(function(response){
        if(response=== false){
          logger.createOperationLog();
        }
      })
      .catch(function(err){
        console.log(err);
      })
  }
  //--------------- Handle emitter output messages---------
  //templates for handling output from cloneEngine emitters
  var handleEmitterOutput = function(msg){

    if (LOG_OUTPUT === 'yes'){
      //insert message into log
      logger.insert(msg)
        //display CloneLogger errors on console
        .catch(function(err){
          console.log('CloneLogger ERROR:'+err);
      });
    }

    //configure output message on console...
    if (DISPLAY_MESSAGES_ON_CONSOLE === 'yes') {
      if(msg.msgType === 'operation'){console.log(msg);}
      else if(msg.msgType === 'ERROR!'){
        //Error just adds a red font
        console.log(
          msg.activityId +' '+msg.operationId+' '+msg.step+' '+msg.operation+' \x1b[31m'+msg.msgType+'\x1b[0m'+' '+msg.time+' => '+msg.description);
      }else{
        console.log(
          msg.activityId +' '+msg.operationId+' '+msg.step+' '+msg.operation+' '+msg.msgType+' '+msg.time+' => '+msg.description);
      }
    }
  };

  //----------------- Create a Clone Engine---------------
  function runCloneEngineOperation (plan) {

    //initialize a new cloning engine
    let engine = new CloneEngine(SOURCE_DB,DESTINATION_DB,TIMEZONE);

    //configure CloneEngine listiners and how to handle outputs
    engine.on('start',function(msg){handleEmitterOutput(msg);})
    engine.on('connection',function(msg){handleEmitterOutput(msg);})
    engine.on('rowsToProcess',function(msg){handleEmitterOutput(msg);})
    engine.on('process',function(msg){handleEmitterOutput(msg);})
    engine.on('countsMatch',function(msg){handleEmitterOutput(msg);})
    engine.on('finish',function(msg){handleEmitterOutput(msg);})
    engine.on('ERROR!',function(msg){handleEmitterOutput(msg);})
    engine.on('operation',function(msg){handleEmitterOutput(msg);})

    //run engine
    engine.run(plan);

    //upon completion of operation resolve promise
    return new Promise(function(resolve, reject){
      if (STOP_ON_ERROR === 'no') {
        engine.on('ERROR!',function(msg){if (msg){resolve(msg);}})
      }else{
        engine.on('ERROR!',function(msg){if (msg){reject(msg);}})
      }
      engine.on('finish',function(msg){if (msg) {resolve(true);}})
    })
  };


  ////////////////////////////////////// RUN ENGINE OPERATIONS ////////////////////////////////////

  //Run CloneEngine Operations (synchronously)...
  if (RUN_TYPE === 'sync') {

    runCloneEngineOperation({
      sourceTableName                     : 'table_a',
      destinationTableName                : 'clone_a',
      overwriteDestTblIfExists            : OVERWRITE_FOR_ALL_OPS
    })
    .then(function(){
      runCloneEngineOperation({
        sourceTableName                     : 'table_b',
        destinationTableName                : 'clone_b',
        overwriteDestTblIfExists            : OVERWRITE_FOR_ALL_OPS
    })
    .then(function(){
      runCloneEngineOperation({
        sourceTableName                     : 'table_c',
        destinationTableName                : 'clone_c',
        overwriteDestTblIfExists            : OVERWRITE_FOR_ALL_OPS
    })
    .then(function(){
      runCloneEngineOperation({
        sourceTableName                     : 'table_d',
        destinationTableName                : 'clone_d',
        overwriteDestTblIfExists            : OVERWRITE_FOR_ALL_OPS
    })
    }).catch(function(err){console.log(err);})
    }).catch(function(err){console.log(err);})
    }).catch(function(err){console.log(err);});
  }

  //Run CloneEngine Operations (asynchronously)...
  if (RUN_TYPE === 'async') {

    runCloneEngineOperation({
      sourceTableName                     : 'table_a',
      destinationTableName                : 'clone_a',
      overwriteDestTblIfExists            : OVERWRITE_FOR_ALL_OPS
    })

    runCloneEngineOperation({
      sourceTableName                     : 'table_b',
      destinationTableName                : 'clone_b',
      overwriteDestTblIfExists            : OVERWRITE_FOR_ALL_OPS
    })


    runCloneEngineOperation({
      sourceTableName                     : 'table_c',
      destinationTableName                : 'clone_c',
      overwriteDestTblIfExists            : OVERWRITE_FOR_ALL_OPS
    })

    runCloneEngineOperation({
      sourceTableName                     : 'table_d',
      destinationTableName                : 'clone_d',
      overwriteDestTblIfExists            : OVERWRITE_FOR_ALL_OPS
    })
  }

  ```
