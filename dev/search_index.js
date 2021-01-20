var documenterSearchIndex = {"docs":
[{"location":"#Observables","page":"Home","title":"Observables","text":"","category":"section"},{"location":"","page":"Home","title":"Home","text":"Observables are like Refs but you can listen to changes.","category":"page"},{"location":"","page":"Home","title":"Home","text":"using Observables\n\nobservable = Observable(0)\n\nobs_func = on(observable) do val\n    println(\"Got an update: \", val)\nend\n\nobservable[] = 42","category":"page"},{"location":"","page":"Home","title":"Home","text":"To get the value of an observable index it with no arguments","category":"page"},{"location":"","page":"Home","title":"Home","text":"observable[]","category":"page"},{"location":"","page":"Home","title":"Home","text":"To remove a handler use off with the return value of on:","category":"page"},{"location":"","page":"Home","title":"Home","text":"off(obs_func)","category":"page"},{"location":"#Weak-Connections","page":"Home","title":"Weak Connections","text":"","category":"section"},{"location":"","page":"Home","title":"Home","text":"If you use on with weak = true, the connection will be removed when the return value of on is garbage collected. This can make it easier to clean up connections that are not used anymore.","category":"page"},{"location":"","page":"Home","title":"Home","text":"obs_func = on(observable, weak = true) do val\n    println(\"Got an update: \", val)\nend\n# as long as obs_func is reachable the connection will stay\n\nobs_func = nothing\n# now garbage collection can at any time clear the connection","category":"page"},{"location":"#Async-operations","page":"Home","title":"Async operations","text":"","category":"section"},{"location":"#Delay-an-update","page":"Home","title":"Delay an update","text":"","category":"section"},{"location":"","page":"Home","title":"Home","text":"x = Observable(1)\ny = map(x) do val\n    @async begin\n        sleep(0.5)\n        return val + 1\n    end\nend","category":"page"},{"location":"#Multiply-updates","page":"Home","title":"Multiply updates","text":"","category":"section"},{"location":"","page":"Home","title":"Home","text":"If you want to fire several events on an update (e.g. for interpolating animations), you can use a channel:","category":"page"},{"location":"","page":"Home","title":"Home","text":"x = Observable(1)\ny = map(x) do val\n    Channel() do channel\n        for i in 1:10\n            put!(channel, i + val)\n        end\n    end\nend","category":"page"},{"location":"#The-same-works-for-constructing-observables","page":"Home","title":"The same works for constructing observables","text":"","category":"section"},{"location":"","page":"Home","title":"Home","text":"Observable(@async begin\n    sleep(0.5)\n    return 1 + 1\nend)\nObservable(Channel() do channel\n    for i in 1:10\n        put!(channel, i + 1)\n    end\nend)","category":"page"},{"location":"#How-is-it-different-from-Reactive.jl?","page":"Home","title":"How is it different from Reactive.jl?","text":"","category":"section"},{"location":"","page":"Home","title":"Home","text":"The main difference is Signals are manipulated mostly by converting one signal to another. For example, with signals, you can construct a changing UI by creating a Signal of UI objects and rendering them as the signal changes. On the other hand, you can use an Observable both as an input and an output. You can arbitrarily attach outputs to inputs allowing structuring code in a signals-and-slots kind of pattern.","category":"page"},{"location":"","page":"Home","title":"Home","text":"Another difference is Observables are synchronous, Signals are asynchronous. Observables may be better suited for an imperative style of programming.","category":"page"},{"location":"#API","page":"Home","title":"API","text":"","category":"section"},{"location":"#Public","page":"Home","title":"Public","text":"","category":"section"},{"location":"","page":"Home","title":"Home","text":"Modules = [Observables]\nPrivate = false","category":"page"},{"location":"#Observables.Observable","page":"Home","title":"Observables.Observable","text":"Like a Ref but updates can be watched by adding a handler using on.\n\n\n\n\n\n","category":"type"},{"location":"#Observables.async_latest-Union{Tuple{Observables.AbstractObservable{T}}, Tuple{T}, Tuple{Observables.AbstractObservable{T},Any}} where T","page":"Home","title":"Observables.async_latest","text":"async_latest(observable::AbstractObservable, n=1)\n\nReturns an Observable which drops all but the last n updates to observable if processing the updates takes longer than the interval between updates.\n\nThis is useful if you want to pass the updates from, say, a slider to a plotting function that takes a while to compute. The plot will directly compute the last frame skipping the intermediate ones.\n\nExample:\n\nobservable = Observable(0)\nfunction compute_something(x)\n    for i=1:10^8 rand() end # simulate something expensive\n    println(\"updated with $x\")\nend\no_latest = async_latest(observable, 1)\non(compute_something, o_latest) # compute something on the latest update\n\nfor i=1:5\n    observable[] = i\nend\n\n\n\n\n\n","category":"method"},{"location":"#Observables.connect!-Tuple{Observables.AbstractObservable,Observables.AbstractObservable}","page":"Home","title":"Observables.connect!","text":"connect!(o1::AbstractObservable, o2::AbstractObservable)\n\nForwards all updates from o2 to o1.\n\nSee also Observables.ObservablePair.\n\n\n\n\n\n","category":"method"},{"location":"#Observables.obsid-Tuple{Observable}","page":"Home","title":"Observables.obsid","text":"obsid(observable::Observable)\n\nGets a unique id for an observable!\n\n\n\n\n\n","category":"method"},{"location":"#Observables.off-Tuple{Observables.AbstractObservable,Any}","page":"Home","title":"Observables.off","text":"off(observable::AbstractObservable, f)\n\nRemoves f from listeners of observable.\n\nReturns true if f could be removed, otherwise false.\n\n\n\n\n\n","category":"method"},{"location":"#Observables.off-Tuple{Observables.ObserverFunction}","page":"Home","title":"Observables.off","text":"off(obsfunc::ObserverFunction)\n\nRemove the listener function obsfunc.f from the listeners of obsfunc.observable. Once obsfunc goes out of scope, this should allow obsfunc.f and all the values it might have closed over to be garbage collected (unless there are other references to it).\n\n\n\n\n\n","category":"method"},{"location":"#Observables.on-Tuple{Any,Observables.AbstractObservable}","page":"Home","title":"Observables.on","text":"on(f, observable::AbstractObservable; weak = false)\n\nAdds function f as listener to observable. Whenever observable's value is set via observable[] = val f is called with val.\n\nReturns an ObserverFunction that wraps f and observable and allows to disconnect easily by calling off(observerfunction) instead of off(f, observable).\n\nIf weak = true is set, the new connection will be removed as soon as the returned ObserverFunction is not referenced anywhere and is garbage collected. This is useful if some parent object makes connections to outside observables and stores the resulting ObserverFunction instances. Then, once that parent object is garbage collected, the weak observable connections are removed automatically.\n\n\n\n\n\n","category":"method"},{"location":"#Observables.onany-Union{Tuple{F}, Tuple{F,Vararg{Any,N} where N}} where F","page":"Home","title":"Observables.onany","text":"onany(f, args...)\n\nCalls f on updates to any observable refs in args. args may contain any number of Observable objects. f will be passed the values contained in the refs as the respective argument. All other objects in args are passed as-is.\n\n\n\n\n\n","category":"method"},{"location":"#Observables.throttle-Union{Tuple{T}, Tuple{Any,Observables.AbstractObservable{T}}} where T","page":"Home","title":"Observables.throttle","text":"throttle(dt, input::AbstractObservable)\n\nThrottle a signal to update at most once every dt seconds. The throttled signal holds the last update of the input signal during each dt second time window.\n\n\n\n\n\n","category":"method"},{"location":"#Internal","page":"Home","title":"Internal","text":"","category":"section"},{"location":"","page":"Home","title":"Home","text":"Modules = [Observables]\nPublic = false","category":"page"},{"location":"#Observables.ObserverFunction","page":"Home","title":"Observables.ObserverFunction","text":"mutable struct ObserverFunction <: Function\n\nFields:\n\nf::Function\nobservable::AbstractObservable\nweak::Bool\n\nObserverFunction is intended as the return value for on because we can remove the created closure from obsfunc.observable's listener vectors when ObserverFunction goes out of scope - as long as the weak flag is set. If the weak flag is not set, nothing happens when the ObserverFunction goes out of scope and it can be safely ignored. It can still be useful because it is easier to call off(obsfunc) instead of off(observable, f) to release the connection later.\n\n\n\n\n\n","category":"type"},{"location":"#Base.getindex-Tuple{Observable}","page":"Home","title":"Base.getindex","text":"observable[]\n\nReturns the current value of observable.\n\n\n\n\n\n","category":"method"},{"location":"#Base.map!-Union{Tuple{F}, Tuple{F,Observables.AbstractObservable,Vararg{Any,N} where N}} where F","page":"Home","title":"Base.map!","text":"map!(f, observable::AbstractObservable, args...; update::Bool=true)\n\nUpdates observable with the result of calling f with values extracted from args. args may contain any number of Observable objects. f will be passed the values contained in the refs as the respective argument. All other objects in args are passed as-is.\n\nBy default observable gets updated immediately, but this can be suppressed by specifying update=false.\n\n\n\n\n\n","category":"method"},{"location":"#Base.map-Union{Tuple{F}, Tuple{F,Observables.AbstractObservable,Vararg{Any,N} where N}} where F","page":"Home","title":"Base.map","text":"map(f, observable::AbstractObservable, args...)\n\nCreates a new observable ref which contains the result of f applied to values extracted from args. The second argument observable must be an observable ref for dispatch reasons. args may contain any number of Observable objects. f will be passed the values contained in the refs as the respective argument. All other objects in args are passed as-is.\n\n\n\n\n\n","category":"method"},{"location":"#Base.map-Union{Tuple{T}, Tuple{F}, Tuple{F,Type{Observable{T}},Vararg{Any,N} where N}} where T where F","page":"Home","title":"Base.map","text":"map(f, Observable{T}, args...)\n\nCreates an Observable{T} containing the result of calling f with values extracted from args. args may contain any number of Observable objects. f will be passed the values contained in the refs as the respective argument. All other objects in args are passed as-is.\n\n\n\n\n\n","category":"method"},{"location":"#Base.notify-Tuple{Observables.AbstractObservable}","page":"Home","title":"Base.notify","text":"notify(observable::AbstractObservable)\n\nUpdate all listeners of observable.\n\n\n\n\n\n","category":"method"},{"location":"#Base.setindex!-Tuple{Observable,Any}","page":"Home","title":"Base.setindex!","text":"observable[] = val\n\nUpdates the value of an Observable to val and call its listeners.\n\n\n\n\n\n","category":"method"},{"location":"#Observables.to_value-Tuple{Any}","page":"Home","title":"Observables.to_value","text":"to_value(x::Union{Any, AbstractObservable})\n\nExtracts the value of an observable, and returns the object if it's not an observable!\n\n\n\n\n\n","category":"method"},{"location":"#Observables.@map!-Tuple{Any,Any}","page":"Home","title":"Observables.@map!","text":"@map!(d, expr)\n\nWrap AbstractObservables in & to compute expression expr using their value: the expression will be computed every time the AbstractObservables are updated and d will be set to match that value.\n\nExamples\n\njulia> a = Observable(2);\n\njulia> b = Observable(3);\n\njulia> c = Observable(10);\n\njulia> Observables.@map! c &a + &b;\n\njulia> c[]\n10\n\njulia> a[] = 100\n100\n\njulia> c[]\n103\n\n\n\n\n\n","category":"macro"},{"location":"#Observables.@map-Tuple{Any}","page":"Home","title":"Observables.@map","text":"@map(expr)\n\nWrap AbstractObservables in & to compute expression expr using their value. The expression will be computed when @map is called and  every time the AbstractObservables are updated.\n\nExamples\n\njulia> a = Observable(2);\n\njulia> b = Observable(3);\n\njulia> c = Observables.@map &a + &b;\n\njulia> c[]\n5\n\njulia> a[] = 100\n100\n\njulia> c[]\n103\n\n\n\n\n\n","category":"macro"},{"location":"#Observables.@on-Tuple{Any}","page":"Home","title":"Observables.@on","text":"@on(expr)\n\nWrap AbstractObservables in & to execute expression expr using their value. The expression will be computed every time the AbstractObservables are updated.\n\nExamples\n\njulia> a = Observable(2);\n\njulia> b = Observable(3);\n\njulia> Observables.@on println(\"The sum of a+b is $(&a + &b)\");\n\njulia> a[] = 100;\nThe sum of a+b is 103\n\n\n\n\n\n","category":"macro"}]
}
