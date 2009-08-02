/* See license.txt for terms of usage */

FBL.ns(function() { with (FBL) { 

/**
 * Model implementation.
 */
Firebug.LogToNetPanelModule = extend(Firebug.Module, 
{ 
    dispatchName: "LogToNetPanel",
    initializeUI: function(detachArgs)
    {
        this.attachListeners();
    },

    watchWindow: function(context, win)
    {
    },
    unwatchWindow: function(context, win)
    {
    },

    attachListeners: function()
    {
        Firebug.Console.addListener(this);  // to get onConsoleInjection
    },
    logFormatted: function(context, params, command, source)
    {
      if(command == "debug" && params[0] == "netpanel")
      {
        if (context.netProgress)
        {
          var file;
          // TODO: figure out a way to set up a new phase if none exists:
          //       now we cannot log until a real NET request is started
          var phase = context.netProgress.phases[0];
          // Q: are there cases where we have multiple phases and 
          //    we wouldn't want to use the first one
          if(!phase)Firebug.Console.log("geen phase");
          for(var i = 0; i< phase.files.length;i++)
          {
            if(phase.files[i].method == "LOG" && phase.files[i].href == params[1])
            {
              file = phase.files[i];
              break;
            }
          }
          if(file)
          {
            file.endTime = (new Date()).getTime();
            respondedTime = (new Date()).getTime();

          }else{
            file = {
              href:  params[1], 
              document: {},
              method: "LOG", 
              loaded: true, 
              startTime: (new Date()).getTime(), 
              connectingTime: (new Date()).getTime(), 
              waitingForTime: (new Date()).getTime(), 
              resolvingTime: (new Date()).getTime(), 
              respondedTime: (new Date()).getTime(), 
              endTime: (new Date()).getTime(), 
              fromCache:false,
              responseStatus: 200, 
              responseText: "", 
              phase : context.netProgress.phase,
              category: "none",
              size:0,
              phase: phase
            };
            phase.files.push(file);
          }
        
          //Firebug.Console.log(phase.files, context, "dir", Firebug.DOMPanel.DirTable);
          //Firebug.Console.log(context.netProgress.phases, context, "dir", Firebug.DOMPanel.DirTable);
          //Firebug.Console.log(file, context, "dir", Firebug.DOMPanel.DirTable);
        }
      }
    },


}); 


/**
 * Registration
 */
Firebug.registerModule(Firebug.LogToNetPanelModule); 

}});
