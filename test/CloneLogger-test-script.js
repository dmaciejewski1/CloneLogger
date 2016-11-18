/*****************************************************************
  NAME: CloneLogger-test-script.js
  PATH: test/CloneLogger-test-script.js
  WHAT: Unit tests for "cloneLogger.js"
******************************************************************/
"use strict";
const chai = require("chai");
const should = chai.should();
const CloneLogger = require('../lib/CloneLogger.js');

const ACTIVITY_TEST_LOG = 'AAAA';
const OPERATION_TEST_LOG = 'AABB';
const ORACLE_CONNECTION =       {// must have read, write, delete permissions
        user            : '',
        password        : '',
        host            : '',
        port            : 0,
        service         : '' //use either "service" or "sid" properties
      };
var logger = new CloneLogger(ORACLE_CONNECTION);// use default
var loggerSpecified = new CloneLogger(ORACLE_CONNECTION,
  {activityLog : ACTIVITY_TEST_LOG,// specifiy log
   operationLog : OPERATION_TEST_LOG}
);
describe('Testing the \"cloneLogger.js\" library...', function(){

//*<----SWITCH OFF (remove one forward slash)-----
  describe('The \"CloneLogger.detectActivityLog\" function:', function(){

    it('returns false if an activity log table does not exist', function (done){
      logger.detectActivityLog()
        .then(function(message){
            message.should.eql(false);
            done();
        })
        .catch(function(err){console.log(err);})
    })

  })
//*/
exist
//*<----SWITCH OFF (remove one forward slash)-----
  describe('The \"CloneLogger.detectOperationLog\" function:', function(){

    it('returns false if a summary log table does not exist', function (done){
      logger.detectOperationLog()
        .then(function(message){
            message.should.eql(false);
            done();
        })
        .catch(function(err){console.log(err);})
    })

  })
//*/

//*<----SWITCH OFF (remove one forward slash)-----
  describe('The \"CloneLogger.createActivityLog\" function:', function(){
    it('returns true when an activity log table has been created', function (done){
      logger.createActivityLog()
        .then(function(message){
            message.should.eql(true)
            done();
        })
        .catch(function(err){console.log(err);})
    })

    it('returns false when an activity log table (to be created) already exists', function (done){
      logger.createActivityLog()
        .then(function(message){
            message.should.eql(false)
            done();
        })
        .catch(function(err){console.log(err);})
    })

  })
//*/

//*<----SWITCH OFF (remove one forward slash)-----
  describe('The \"CloneLogger.createOperationLog\" function:', function(){
    it('returns true when an operation log table has been created', function (done){
      logger.createOperationLog()
        .then(function(message){
            message.should.eql(true)
            done();
        })
        .catch(function(err){console.log(err);})
    })

    it('returns false when an operation log table (to be created) already exists', function (done){
      logger.createOperationLog()
        .then(function(message){
            message.should.eql(false)
            done();
        })
        .catch(function(err){console.log(err);})
    })

  })
//*/

//*<----SWITCH OFF (remove one forward slash)-----
  describe('The \"CloneLogger.detectActivityLog\" function:', function(){

    it('returns true if an activity log table exists', function (done){
      logger.detectActivityLog()
        .then(function(message){
            message.should.eql(true);
            done();
        })
        .catch(function(err){console.log(err);})
    })

  })
//*/

//*<----SWITCH OFF (remove one forward slash)-----
  describe('The \"CloneLogger.detectOperationLog\" function:', function(){

    it('returns true if an operation log table exists', function (done){
      logger.detectOperationLog()
        .then(function(message){
            message.should.eql(true);
            done();
        })
        .catch(function(err){console.log(err);})
    })

  })
//*/

//*<----SWITCH OFF (remove one forward slash)-----
  describe('The \"CloneLogger.insert\" function:', function(){
    it('returns true if a log entry was inserted in an activity log table', function (done){
      let msg ={
        'operation'     : '0',
        'operationId'   : '1',
        'msgType'       : 'test type',
        'stepUniqueId'  : '2',
        'step'          : 3 ,
        'time'          : '2016-01-01T00:00:00+00:00',
        'description'   : 'Testing 123'
      };
      logger.insert(msg)
        .then(function(message){
            message.should.eql(true);
            done();
        })
        .catch(function(err){console.log(err);})
    })
  })
//*/

//*<----SWITCH OFF (remove one forward slash)-----
  describe('The \"CloneLogger.insert\" function:', function(){
    it('returns true if a log entry was inserted in an operation log table', function (done){
      let msg ={
        'operation'             : '0',
        'operationId'           : '1',
        'description'           : 'Testing 123',
        'msgType'               : 'summary',
        'hostSystem'            : 'some super computer',
        'operationStartTime'    : '2016-01-01T00:00:00.000+00:00',
        'operationEndTime'      : '2016-01-01T00:00:00.000+00:00',
        'bytesCloned'           : '1000',
        'secondsTaken'          : 1,
        'stepsTaken'            : 1,
        'sourceDb'              : {'name': 'testsourcedb',
                                   'make': 'postgres',
                                  'table':'testsourcetable',
                                   'rows':1
                                  },
        'destinationDb'         : {'name': 'testdestdb',
                                   'make': 'oracle',
                                  'table': 'testdesttable',
                                   'rows': 1,
                                'created':'2016-01-01T00:00:00.000+00:00',
                        'tableWasRebuilt': 'yes'
                                  },
        'rowCountsMatch'        : 'yes'
      };
      logger.insert(msg)
        .then(function(message){
            message.should.eql(true);
            done();
        })
        .catch(function(err){console.log(err);})
    })
  })
//*/


//*<----SWITCH OFF (remove one forward slash)-----
  describe('The \"CloneLogger.dropActivityLog\" function:', function(){
    it('returns true when an activity log table is dropped', function (done){
      logger.dropActivityLog()
        .then(function(message){
            message.should.eql(true)
            done();
        })
        .catch(function(err){console.log(err);})
    })

    it('returns false when the activity log table (to be dropped) does not exist', function (done){
      logger.dropActivityLog()
        .then(function(message){
            message.should.eql(false)
            done();
        })
        .catch(function(err){console.log(err);})
    })

  })
//*/

//*<----SWITCH OFF (remove one forward slash)-----
  describe('The \"CloneLogger.dropOperationLog\" function:', function(){
    it('returns true when an operation log table is dropped', function (done){
      logger.dropOperationLog()
        .then(function(message){
            message.should.eql(true)
            done();
        })
        .catch(function(err){console.log(err);})
    })

    it('returns false when the operation log table (to be dropped) does not exist', function (done){
      logger.dropOperationLog()
        .then(function(message){
            message.should.eql(false)
            done();
        })
        .catch(function(err){console.log(err);})
    })

  })
//*/

//----------------TEST WITH EXPLICITLY SPECIFIED LOGS ---------------------

//*<----SWITCH OFF (remove one forward slash)-----
  describe('The \"CloneLogger.detectActivityLog\" function:', function(){

    it('returns false if a SPECIFIED activity log table does not exist', function (done){
      loggerSpecified.detectActivityLog()
        .then(function(message){
            message.should.eql(false);
            done();
        })
        .catch(function(err){console.log(err);})
    })

  })
//*/

//*<----SWITCH OFF (remove one forward slash)-----
  describe('The \"CloneLogger.detectOperationLog\" function:', function(){

    it('returns false if a SPECIFIED operation log table does not exist', function (done){
      loggerSpecified.detectActivityLog()
        .then(function(message){
            message.should.eql(false);
            done();
        })
        .catch(function(err){console.log(err);})
    })

  })
//*/


//*<----SWITCH OFF (remove one forward slash)-----
  describe('The \"CloneLogger.createActivityLog\" function:', function(){
    //*<----SWITCH OFF (remove one forward slash)-----
    it('returns true when a SPECIFIED activity log table has been created', function (done){
      loggerSpecified.createActivityLog()
        .then(function(message){
            message.should.eql(true)
            done();
        })
        .catch(function(err){console.log(err);})
    })
    it('returns false when a SPECIFIED activity log table (to be created) already exists', function (done){
      loggerSpecified.createActivityLog()
        .then(function(message){
            message.should.eql(false);
            done();
        })
        .catch(function(err){console.log(err);})
    })
  })
//*/

//*<----SWITCH OFF (remove one forward slash)-----
  describe('The \"CloneLogger.createOperationLog\" function:', function(){
    //*<----SWITCH OFF (remove one forward slash)-----
    it('returns true when a SPECIFIED operation log table has been created', function (done){
      loggerSpecified.createOperationLog()
        .then(function(message){
            message.should.eql(true)
            done();
        })
        .catch(function(err){console.log(err);})
    })
    it('returns false when a SPECIFIED operation log table (to be created) already exists', function (done){
      loggerSpecified.createOperationLog()
        .then(function(message){
            message.should.eql(false);
            done();
        })
        .catch(function(err){console.log(err);})
    })
  })
//*/

//*<----SWITCH OFF (remove one forward slash)-----
  describe('The \"CloneLogger.detectActivityLog\" function:', function(){

    it('returns true if a SPECIFIED activity log table exists', function (done){
      loggerSpecified.detectActivityLog()
        .then(function(message){
            message.should.eql(true);
            done();
        })
        .catch(function(err){console.log(err);})
    })

  })
//*/

//*<----SWITCH OFF (remove one forward slash)-----
  describe('The \"CloneLogger.detectOperationLog\" function:', function(){

    it('returns true if a SPECIFIED operation log table exists', function (done){
      loggerSpecified.detectOperationLog()
        .then(function(message){
            message.should.eql(true);
            done();
        })
        .catch(function(err){console.log(err);})
    })

  })
//*/

//*<----SWITCH OFF (remove one forward slash)-----
  describe('The \"CloneLogger.insert\" function:', function(){
    it('returns true if a log entry was inserted in an activity log table', function (done){
      let msg ={
        'operation'     : '0',
        'operationId'   : '1',
        'msgType'       : 'test type',
        'stepUniqueId'  : '2',
        'step'          : 3 ,
        'time'          : '2016-01-01T00:00:00+00:00',
        'description'   : 'Testing 123'
      };
      loggerSpecified.insert(msg)
        .then(function(message){
            message.should.eql(true);
            done();
        })
        .catch(function(err){console.log(err);})
    })
  })
//*/

//*<----SWITCH OFF (remove one forward slash)-----
  describe('The \"CloneLogger.insert\" function:', function(){
    it('returns true if a log entry was inserted in an operation log table', function (done){
      let msg ={
        'operation'             : '0',
        'operationId'           : '1',
        'description'           : 'Testing 123',
        'msgType'               : 'summary',
        'hostSystem'            : 'some super computer',
        'operationStartTime'    : '2016-01-01T00:00:00.000+00:00',
        'operationEndTime'      : '2016-01-01T00:00:00.000+00:00',
        'bytesCloned'           : '1000',
        'secondsTaken'          : 1,
        'stepsTaken'            : 1,
        'sourceDb'              : {'name': 'testsourcedb',
                                   'make': 'postgres',
                                  'table':'testsourcetable',
                                   'rows':1
                                  },
        'destinationDb'         : {'name': 'testdestdb',
                                   'make': 'oracle',
                                  'table': 'testdesttable',
                                   'rows': 1,
                                'created':'2016-01-01T00:00:00.000+00:00',
                        'tableWasRebuilt': 'yes'
                                  },
        'rowCountsMatch'        : 'yes'
      };
      loggerSpecified.insert(msg)
        .then(function(message){
            message.should.eql(true);
            done();
        })
        .catch(function(err){console.log(err);})
    })
  })
//*/





//*<----SWITCH OFF (remove one forward slash)-----
  describe('The \"CloneLogger.dropOperationLog\" function:', function(){
    it('returns true when a SPECIFIED operation log table is dropped', function (done){
      loggerSpecified.dropOperationLog()
        .then(function(message){
            message.should.eql(true)
            done();
        })
        .catch(function(err){console.log(err);})
    })

    it('returns false when the SPECIFIED operation log table (to be dropped) does not exist', function (done){
      loggerSpecified.dropOperationLog()
        .then(function(message){
            message.should.eql(false)
            done();
        })
        .catch(function(err){console.log(err);})
    })

  })
//*/

//*<----SWITCH OFF (remove one forward slash)-----
  describe('The \"CloneLogger.dropActivityLog\" function:', function(){
    it('returns true when a SPECIFIED activity log table is dropped', function (done){
      loggerSpecified.dropActivityLog()
        .then(function(message){
            message.should.eql(true)
            done();
        })
        .catch(function(err){console.log(err);})
    })

    it('returns false when the SPECIFIED activity log table (to be dropped) does not exist', function (done){
      loggerSpecified.dropActivityLog()
        .then(function(message){
            message.should.eql(false)
            done();
        })
        .catch(function(err){console.log(err);})
    })

  })
//*/





})
