!{{
    "dateCreated": 1597528385518,
    "dateUpdated": 1597528385518,
    "pageTitle": "React Hooks vs FP",
    "tags": "[]",
    "id": "427ea99e-376f-493d-94d7-c961ffff7f8e",
    "abstract": "With the release of React 16.8 we got the much anticipated hooks! And immediatelly the whole dev community lost their collective mind about how amazing the hooks are! How much more functional we can write our React components/apps... whatever they are writing. Well, bad news - there is nothing functional about the code that uses hooks..."
}}

# React Hooks vs FP

With the release of React 16.8 we got the much anticipated hooks! And immediatelly the whole dev community lost their collective mind about how amazing the hooks are! How much more functional we can write our React components/apps... whatever they are writing.

I love functional programming. It makes me feel secure. I know this is not a property of the paradigm ... the code is as good as the developer who creates it. I've seen very bad functional code, and very good OOP code. The functional code I produce is very dense - which may be good or bad depending on your perspective.

The reason I am putting this rant online is because of conversations I had with various senior developers around the subject. There seems to be a gross misunderstanding about what is FP (in the JavaScript community here in BG) and what is React. And how React is functional, and how it is not...

The main thing that got me to write this is a statement from a developer "they want to write only functional code, thus using component implementations with functions and hooks".

Here follows my take based on my experience with FP and React.

## Let's start by evaluating the motivation for adding hooks

>Hooks solve a wide variety of seemingly unconnected problems in React that we’ve encountered over five years of writing and maintaining tens of thousands of components. Whether you’re learning React, use it daily, or even prefer a different library with a similar component model, you might recognize some of these problems. - React documentation

Let's check what React docs have to say about it:

- "It’s hard to reuse stateful logic between components"
- "Complex components become hard to understand"
- "Classes confuse both people and machines"

## It’s hard to reuse stateful logic between components

No it is not... It was never hard... However, it requires though and design upfront. State as implementation was never mandatory part of the component class or functional based. Most sensible devs I know of, did create the state outside of the React context and passed it as props. And that's all... it is easy to write, easy to maintain and extend, easy to share and test...

>React doesn’t offer a way to “attach” reusable behavior to a component (for example, connecting it to a store).

Yes, that is not the job of the library to provide... React should remain focused on the presentation. The framework should not handle state that is outside of what is related to the component rendering. All the rest should be external and provided as props. And please don't get me started on the context API...

## Complex components become hard to understand

Yes - a 300 line class/function/method is difficult to understand, so what? How does hooks solve this? How is 300 line hook easier to understand than anything else with similar LoK.

The authors claim that class methods such as: `componentDidMount`, `componentDidUpdate`, `componentWillUnmount`; can be confusing and scary. So they replaced them with 1 function with one hell of a signature...

The abomination I am talking about is called [useEffect](https://reactjs.org/docs/hooks-reference.html#useeffect) and I don't want to copy/paste one hundred sentences so I will just shortlist what this function does:

**{SARCASM ALERT}** If you are sensitive to sarcasm, you might want to read someone else's blog...

- **"Accepts a function that contains imperative, possibly effectful code."** => good, open the path to the dark side...
- **"The function passed to useEffect will run after the render is committed to the screen."** => I am sure this is going to only become simpler with the async rendering we are waiting to come with future React versions.
- **"Think of effects as an escape hatch from React’s purely functional world into the imperative world."** => we might need to re-align about which is the "purely functional" part of React. Probably they mean the `context` API? There is nothing inherently functional about the React library.
- **"By default, effects run after every completed render, but you can choose to fire them only when certain values have changed."** => I am sure no one is going to have to deal with issues coming from cyclomatic complexity here...
- **"...the function passed to useEffect may return a clean-up function..."** => nice, so they escaped the declarative world so much that now the function sigranture and return values are just whatever the dev needs. I see no potential for all the dirty logic to go inside one hook callback.
- **"if a component renders multiple times (as they typically do), the previous effect is cleaned up before executing the next effect"** => Only if we return "clean-up" function, I guess?
- **"Timing of effects"**
- **"Unlike componentDidMount and componentDidUpdate, the function passed to useEffect fires after layout and paint, during a deferred event."** => good, good, no potential for errors here... the developers need to just remember that.
- **"However, not all effects can be deferred. For example, a DOM mutation that is visible to the user must fire synchronously before the next paint so that the user does not perceive a visual inconsistency."** => aha, so we are sometimes async, sometimes sync. Yes that makes sense in the context of execution of the same function.
- **"Conditionally firing an effect"**
- **"The default behavior for effects is to fire the effect after every completed render."** => which may trigger a new render, which is okay I guess. My problem here is the way this sentence is formed makes me thing there is a way to intentionally (or not) change that behavior.
- **"We don’t need to create a new subscription on every update, only if the source prop has changed... To implement this, pass a second argument to useEffect that is the array of values that the effect depends on."** => Ah, manual DI :) my favourite.

So from the above I see most of the software complexity problems encapsulated into the behavior of one function. So far hooks seem like a hack that someone needed to avoid re-designing their application. And that is fine - I've done similar things out of necessity as well. What I don't get is how can someone still call their components "functional" after inserting all of this stateful, mutable, messy, side-effecty code. Components using hooks are not functional, they are procedural. One of the key differences between a procedure and a function (by definitions) is that the latter can't be affected by it's environment.

Also proceeding with the following note:

>Note:
>
>If you use this optimization, make sure the array includes all values from the component scope (such as props and state) that change over time and that are used by the effect. Otherwise, your code will reference stale values from previous renders. Learn more about how to deal with functions and what to do when the array values change too often.
>
>If you want to run an effect and clean it up only once (on mount and unmount), you can pass an empty array ([]) as a second argument. This tells React that your effect doesn’t depend on any values from props or state, so it never needs to re-run. This isn’t handled as a special case — it follows directly from how the dependencies array always works.
>
>If you pass an empty array ([]), the props and state inside the effect will always have their initial values. While passing [] as the second argument is closer to the familiar componentDidMount and componentWillUnmount mental model, there are usually better solutions to avoid re-running effects too often. Also, don’t forget that React defers running useEffect until after the browser has painted, so doing extra work is less of a problem.
>
>We recommend using the exhaustive-deps rule as part of our eslint-plugin-react-hooks package. It warns when dependencies are specified incorrectly and suggests a fix. - React documentation

That seems like a lot to keep in mind for just one of the hooks. Could it be that some SoC is going to clear up things here?

I am not going to list every single hook and strange API decision here. The point of this rant is the departure from my beloved FP towards some sadomasochistic melange of declarative and imperative programming.

## Classes confuse both people and machines

No they don't ... 17 layers of inheritance confuse people and machines. Using classes as the blueprint for objects without more than one level depth and favouring composition is neither confusing nor complicated.

Classes are a very powerful metaphor and tend to encapsulate a lot of meaning behind a single word. This is why they are so prominent in the UI implementations.

It is hard for me to comprehend what is more complicated about classes compared to having one function that does everything. BTW functions organised in a file with only partial visibility (a module if you will) is also sort of a "class". Or sort of a namespace. Or sort of an object. The only reason we call them different names is because we all aggreed what we mean behind these words.

A simple example of the `Foo.ts`:

```typescript
export class Foo {
    static state = {}

    constructor() { }

    private static doPrivateStuff() { }

    static doStuff() { }
}

// is no different than this:

const state = {}

function doPrivateStuff() { }

export function init() { }

export function doStuff() { }

// or that as a matter of fact this:

const state = {}

function doPrivateStuff() { }

export const foo = {
    init() { }
    doStuff() { }
}
```

I've used all of these in different situations, but most importantly my decision depends on how the code is going to be imported and used. All of them have subtle differences when you look beyound the import/export and I will probably write a post about it at some point in time.

## Rules of hooks

[Rules](https://reactjs.org/docs/hooks-rules.html) masterfully copy/pasted text from the original documentation.

>Hooks are JavaScript functions, but you need to follow two rules when using them. We provide a linter plugin to enforce these rules automatically...

### Only Call Hooks at the Top Level

As the documentation states we must not call hooks inside:

- loops
- conditions
- nested functions

>Instead, always use Hooks at the top level of your React function. By following this rule, you ensure that Hooks are called in the same order each time a component renders. That’s what allows React to correctly preserve the state of Hooks between multiple useState and useEffect calls. (If you’re curious, we’ll explain this in depth below.)

Wait, wait... WHAT!? Order of execution, limitation of where and how you write them inside the function body? This smells of a bad abstraction. A very leaky one. **If the developer needs to understand the low level implementation of the hooks in order to use them correctly, it simply means the whole design of this solution is messed up.**

Hm ... maybe if the functions that are returning objects could have a slighlty different syntax that allows for like "construction" logic to be separated from the rest of the function body... So call them like in a constructor or something?

### Only Call Hooks from React Functions

>Don’t call Hooks from regular JavaScript functions. Instead, you can:

- "Call Hooks from React function components."
- "Call Hooks from custom Hooks (we’ll learn about them on the next page)."

>By following this rule, you ensure that all stateful logic in a component is clearly visible from its source code.

So much for logic reuse, test, inject... This contradicts the earlier statement that "Hooks are JavaScript functions...". Functions in JS can be called inside other functions that are not bound to a specific library.

### Explanation

There is the [explanation](https://reactjs.org/docs/hooks-rules.html#explanation) given for the rules.

My arguments agains hooks come not from missunderstanding of the developers' arguments. Neither they are related to me not writing hooks.

This is a solution with obvious drawbacks and limitations. The more you use it, the more your components will become impure. I like the clear separation between functional and class components.

It is easy to understand - when the component is class based it encapsulates state. A functional component on the other hand used to be referentially transparent.

## Summary

I do understand their value, especially when you need to hack-off a bad design and frankestain something to make it work. I have also hit my fair share of edge cases over the past 3-4 years using React on production with the class components.

However, in my work I am making a clear separation between stateful and pure React components. Stateful = class; Pure = function.

If you expected me to give a solution - your expectation are not going to be met. I needed to vent my frustration from the direction this library it taking. Making the API more and more complex, instead of focusing on more modular approach opt-in approach.

However, the addition of the `context` and `hooks` APIs is a warning sign to me. When I work with React I tend to isolate it down to the level of implementation detail. All my logic and state is extracted into service like software components. I use both classes and functions ... Class/arguments/method/propery decorators are super useful and make the code more expressive and easier to read.