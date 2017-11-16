// Call this function in a another function to find out the file from
// which that function was called from. (Inspects the v8 stack trace)
//
// Inspired by http://stackoverflow.com/questions/13227489
export var getCallerFile = function getCallerFile(_position: number = 2)
{
    var oldPrepareStackTrace   = Error['prepareStackTrace']
    Error['prepareStackTrace'] = function (err, stack)
    {
        return stack;
    };
    var stack                  = (<any> new Error()).stack;
    Error['prepareStackTrace'] = oldPrepareStackTrace;

    var position = _position ? _position : 2;

    // stack[0] holds this file
    // stack[1] holds where this function was called
    // stack[2] holds the file we're interested in
    return stack[position] ? stack[position].getFileName() : undefined;
};


function inspect(...args: any[])
{
    args.forEach((arg) => console.dir(arg, {colors: true, depth: 5, showHidden: true}));
}

export {inspect}
