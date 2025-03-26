export const AsyncAction = function(options = {})
{
    // Fill in the default values.
    options = {
        ...{
            success: undefined,
            failure: undefined,
            act: ()=>{},
            finally: ()=>{},
            error: ()=>{},
            canceled: ()=>{},
            announcer: ()=>{},
        },
        ...options,
    };
    
    console.assert(typeof options.act === "function");
    console.assert(typeof options.finally === "function");
    console.assert(typeof options.error === "function");
    console.assert(typeof options.canceled === "function");
    console.assert(typeof options.announcer === "function");

    return async function(args = {})
    {
        try
        {
            const result = await options.act(args);

            if (result === undefined)
            {
                options.canceled(args);

                return undefined;
            }

            (options.success? options.announcer({message: options.success, args}) : null);

            return result;
        }
        catch (error)
        {
            await options.error({error, args});

            (options.failure? options.announcer({message: options.failure, args}) : null);

            return null;
        }
        finally
        {
            try
            {
                await options.finally(args);
            }
            catch (error)
            {
                console.warn("Fatal error in Action's finally:", error);
            }
        }
    };
}
