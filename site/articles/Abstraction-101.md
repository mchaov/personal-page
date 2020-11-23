!{{
    "dateCreated": 1606116218953,
    "dateUpdated": 1606116218953,
    "pageTitle": "Abstraction 101",
    "tags": "[]",
    "id": "fcb1bcb7-ffb8-4741-a49d-3ed75331dd15",
    "abstract": "One of the most important tools at our disposal in every field of science and our daily lives is abstraction! It doesn't enable us to solve problems faster nor it makes our sistems more efficient. Abstraction allows us to grasp complex ideas/problems and discuss them by pin-pointing the important part and ignoring the irrelevant details. It is helping us humans think and express ourselves, rather than helping computers compute."
}}

# Abstraction 101

- [Abstraction 101](#abstraction-101)
  - [What is an abstraction?](#what-is-an-abstraction)
    - [It is something that we do every day](#it-is-something-that-we-do-every-day)
    - [Using something without understanding the internals](#using-something-without-understanding-the-internals)
    - [Abstraction solves the issues at the design level](#abstraction-solves-the-issues-at-the-design-level)
  - [Abstraction layers in a modern computer](#abstraction-layers-in-a-modern-computer)
  - [What happens when our explanation fails?](#what-happens-when-our-explanation-fails)
    - [Leaky abstractions](#leaky-abstractions)
  - [Is there such a thing as a bad abstraction?](#is-there-such-a-thing-as-a-bad-abstraction)
    - [Why is this abstraction more relevant than any other abstraction I could do?](#why-is-this-abstraction-more-relevant-than-any-other-abstraction-i-could-do)
    - [Why was this abstraction chosen to solve this set of problems?](#why-was-this-abstraction-chosen-to-solve-this-set-of-problems)
    - [Is this the right level of abstraction?](#is-this-the-right-level-of-abstraction)
  - [What is a GOOD abstraction?](#what-is-a-good-abstraction)
  - [One more thing!](#one-more-thing)
  - [Further reading](#further-reading)

In this post, I am going to explore some of the questions young programmers face with regards to abstractions in the very early stages of their professional development.

This one doesn't contain code ... abstraction as a concept is best explained without source code. However, in a follow up I am going to explore code examples with TypeScript.

The goal of this post is to help new developers understand the concept of abstraction and not delve into specific textbook examples with animals or cars and so on...

However, I am going to address a couple of questions such as:

- What is an abstraction?
- What is a bad abstraction?
- What is a good abstraction?
- How do you know if you are doing it right?

## What is an abstraction?

One of the most important tools at our disposal in every field of science and our daily lives is abstraction! It doesn't enable us to solve problems faster nor it makes our sistems more efficient. Abstraction allows us to grasp complex ideas/problems and discuss them by pin-pointing the important part and ignoring the irrelevant details. It is helping us humans think and express ourselves, rather than helping computers compute.

Some of the things we can read about abstraction in textbooks or online not exclusively related to programming:

### It is something that we do every day

We use a lot of abstractions in our daily lives. Natural language is a good example of that! What better example than it there is? We are using this abstraction to convey our thought and feelings based on agreed-upon meanings of the words. And that is amazing! Speech is a secondary function of our respiratory system (this is why it is hard to speak when you are trying to catch your breath).

As abstractions, words have meaning - some of them more than one (a.k.a. homonyms): left, park, bat, company. Some of them have contextual meaning: sunshine - talking about the light coming from the sun or when addressing a beloved one.

### Using something without understanding the internals

Like a TV or a computer or any other box with buttons... One of the most important concepts in programming! It allows us to program against only an interface. This allows us to change the implementation of specific components without touching others. It also allows us to create interfaces to our components which define "WHAT" the component can do, and not "HOW" it does it. Abstractions allow us to think of big and complicated concepts as small simple "things".

### Abstraction solves the issues at the design level

That's a big one, but it doesn't mean much to a beginner… However, this entire post is an explanation of the claim!

Simple answer to a big question... Let's start by narrowing down what is abstraction a bit more!

**Abstractions have only one reason to exist - to be 100% specific.** If abstraction has multiple meanings it becomes ambiguous. Abstractions that are open to interpretation are a source of problems and misunderstanding not only in CS but in other fields as well.

>The essence of abstractions is preserving information that is relevant in a given context, and forgetting information that is irrelevant in that context. - John Vogel Guttag

Let's get to some examples, shall we? We use different levels of abstraction to discuss the different aspects of our daily lives.

Consider the following stories: The Matrix, The Lord of The Rings, Spiderman, Star Wars, Harry Potter.

We can discuss all of these by using abstractions such as:

- Story framework: "the heroes journey" where a young protagonist meets an old wise sage. Tragedy happens in the life of the hero which triggers his growth into the master of their destiny overcoming adversities and so on...
- Story setting (genre): "fantasy", "sci-fi", "steam-punk", etc.
- Story style: "drama", "comedy", "action-adventure",
- Story structure: "3 act structure", "5 acts ...", "in medias res"

Each of them is presenting us with a 100% focus on a specific aspect of the story while eliminating all other distractions...

When we discuss story setting (genre) we are focused on world-building, setting the universe rules, etc. We are not discussing the storyline and the details about the protagonist and if they are called Neo, Frodo, Luke, etc. Of course, all of these abstractions are in a constant relationship between them. Example for that - if we chose a "fantasy" setting our protagonist's race will be constrained within the rules of this kind of world ... dwarfs, elves, orcs, humans, etc.

If we choose "elf", we would expect them to be slim and with high dexterity – this is the general perception of the elf created by fantasy-adventure literature. Not that we can't experiment but then we would be moving from one genre to another... Imagine a fat short elf who can't shoot arrows - this setting is more related to the comedy or parody genre.

Let's get back to software… **Everything about software is an abstraction!** Software is written word – it is an expression of a problem in text... Every line of code we write is an abstraction on top of abstraction on top of an abstraction...

Let's look at this simple for-loop:

```typescript
    const arr = [/* stuff to loop */];
    for(let i = 0; i < arr.length; i++){
        if(i % 2 === 0){
            console.log(arr[i])
        }
    }
```

This code means nothing to your CPU! Its only reason to exist in this form is to make it readable for the developer!

So let's check on some of the major layers of abstraction of a computer system. These are not all and I am vastly simplifying here (abstracting if you will) but are some of the more prominent layers.

## Abstraction layers in a modern computer

1. We start by reminding ourselves that our computers run on electricity. Most importantly - electrons traveling from one place to another. This cable from the wall socket going into your PC is the only source of power. Yet you somehow you can read this post or watch a video online, play games, you get the point... Moving the electrons by hand is quite impossible so we add a layer of abstraction on top of that!
2. And the transistors are born. They are allowing you to decide if you want to pass the electrical current or not. While that is quite simple on its own it provides the foundation for modern computing.
3. Deciding to pass current or not is enough to present a 1 or a 0 which allows you to start thinking about simple rules on when to pass 1 or 0. Happily, there is already a well-defined field of Boolean algebra. When we apply the Boolean algebra to combinations of transistors – we get logic gates. All the Boolean algebra rules can be encapsulated in terms of entities called logic gates – each of them defines a different relationship between your inputs and generates an output. You may think about this as hardware if/else  It's just another layer of abstraction on top of transistors. 
4. We can arrange all of these in different ways to do some arithmetic. A circuit called ALU is born out of our logic gates which allows us to do arithmetic logic in binary. We are now focusing on arithmetic while arranging complex grids of transistors but we are no longer thinking in terms of transistors and electric current. We are thinking about math!
5. Up to this point we fed bits one by one into the circuits. Since we can create circuits – we now can create memory circuits such that they hold on to a 0 or a 1 until electric current changes it. Memory is just another type of circuit, but we already transitioned to naming them according to their use case.
6. Then we get circuits containing other circuits like the CPU which is yet another level of abstraction on top of logic gates.
7. Then there is the orchestrator of all things that is the OS which allows you easy access to resources through APIs.
8. And then we have the web browsers! In essence, the software is an abstraction that allows you to orchestrate the movement of electrons around until you eventually get blinking text on the screen. Each new layer of abstraction that we add simplifies our understanding of what is software.

Well, why did I go to this example and not with a simple code one that explains that a dog is a mammal and an animal... This is because textbook examples of abstraction tend to focus specifically on the OOP aspect of it. In the example above we see the power of abstraction at play! Each layer I've described hides the underlying one in such a way that we change our mental model when we switch. Each one of these layers has been a revolution in our understanding of computers and their possible applications. This is the power of abstraction. This is how abstraction solves complexity.

In fact...

>All problems in computer science can be solved by another level of indirection, except for the problem of too many layers of indirection. – David J. Wheeler

In software development, we do the same type of layering every day. Think about your favorite framework, it does a lot of "magic" for you. Whether it is abstracting away what it means to be a web application and you only have to care about the presented information like in WordPress, Squarespace, Drupal, and others. Or it is deeper and allows you to orchestrate components in various ways to achieve your business requirements like Angular and NestJS. Or like React that is abstracting away the DOM and its events.

## What happens when our explanation fails?

The best way to understand a concept is to observe where it fails. We already know that every complex problem can be solved by adding another layer of abstraction between us. **This means more confusion!** Adding a new layer of abstraction should help clarify things more than the added indirection confuses them.

Indirection – I prefer to call it the "Mario Principle" or let's play "find the right level of abstraction"!

Think about this, something doesn't work. Your code looks fine, and, in that rare case, it is! Turns out it is a web browser bug, how do you solve it? Programming specifically to address a big with one environment means something is wrong with the abstraction you use. This applies to OS bugs, hardware bugs, video drivers, and everything that makes your computer systems work.

**One way of abstractions to fail is for them to leak!**

### Leaky abstractions

One of the things that happen when abstractions fail is for them to leak, spilling details about the underlying layer onto the next one. Abstractions leak when details are not completely hidden by the abstraction. The developer using it has to worry about the details and understand them - to correctly use the abstraction.

Imagine a chunk of memory that contains an image. Each cell describes the information needed to print one pixel – it's a number!

There are a couple of ways you can loop through them:

Loop by row:  
![Loop by row](./../i/loop-by-row.gif)  

Loop by column:  
![Loop by column](./../i/loop-by-col.gif)  

Loop by block:  
![Loop by block](./../i/loop-by-block.gif)  

**Which one is the fastest to execute?**

Well, it depends, sadly on many things – but mostly on the type of CPU and size of its internal caches. And that is a problem! Performance in terms of "speed of computation" is important in many aspects of our software. From that bank transaction to the processing of your online shop order, etc. But more importantly, critical systems that run in real-time inside of an airplane, submarine, and others. So how do you optimize this if you don't understand the underlying abstractions? This is what it means for an abstraction to leak.

In this case, when performance goes bad you look at your for loop and wonder: what did I do wrong? The answer is simple: **You did nothing wrong!**

The fastest on our modern CPUs would be to loop by blocks! Now you could have some fun in determining the size of the block  Or read the manual for the CPU you use! And please focus on that it is CPU and not CPUs!!!

If you dig up into the manufacturer's manual you are going to see that for x86 Intel CPUs blocking is faster as long the blocks' sizes fit in the CPU cache 

>Transform the memory domain of a given problem into smaller chunks, rather than sequentially traversing through the entire memory domain. Each chunk should be small enough to fit all the data for a given computation into the cache, thereby maximizing data reuse. - Intel 64 and IA-32 Architectures Optimisation Reference Manual, Figure 4-5 Loop Blocking Access Pattern

By the way for AMD it is a different situation!

**Your "for" loops are not slow – you are just suffering from too many layers of abstraction that you do not understand!** That's more or less what to expect from abstractions that fail/leak.

Although leaks can be considered failures of the abstraction itself. Sometimes that's the best we could do…

You could also search online for other leaky abstractions such as:

- Network – TCP/IP
- SQL
- NFS, SMB
- PNGs
- Spectre/Meltdown

## Is there such a thing as a bad abstraction?

Identifying "bad" abstraction is a chicken and egg problem. It is very hard to give a single simple answer to these questions. As with all good questions in CS, the only correct answer is: "It depends!"!
As we said earlier too much indirection is bad, but to reduce over-abstraction You need to understand the actual reason behind it...

The following questions might help in shaping some answer to the question if an abstraction is bad.

### Why is this abstraction more relevant than any other abstraction I could do?

This includes the understanding idea of the particular abstraction itself, not just calling it bad because of a lack of understanding of the subject matter! And that's not enough - You need to know a better, simpler solution to prove that the current is over abstracted/confusing.

### Why was this abstraction chosen to solve this set of problems?

How did people stumble upon those problems and decide they were worth solving? What other abstractions did they try to end up with that is so complex?

### Is this the right level of abstraction?

The abstraction I am using could be solving the right problem on the wrong layer. Are we solving security in the application layer? Maybe it should be somewhere else ;)

**BAD ABSTRACTIONS ADD MORE CONFUSION!!!**

>The road to hell is paved with good intentions! - Samuel Johnson

Nobody starts to do abstraction because they want to make things harder and more confusing. Also in software (unlike in math), the quality of abstraction could degrade over time while it is being extended. Sometimes the abstractions we are going to stumble upon are the result of historical limitations, personal preferences, or the personal limits of whoever implemented it.

Abstraction could be less than optimal and in the same time it could be the best one we could do!

## What is a GOOD abstraction?

As with the previous question, the right answer is: "It depends!" Is there such a thing as "good" abstraction? Sometimes we might not have access to the right level where abstraction should be done and need to patch up things as we go... Just look at the history of the HTTP protocol and you will find many such examples. Does that make HTTP a good or a bad abstraction? It is certainly useful and growing more and more complicated over time.

As we said a little earlier: **Adding a new layer of abstraction should help clarify things more than the added indirection confuses them.** This is the best measurement we can provide.

To evaluate one try checking the following about the abstraction you are questioning:

1. Simplify reality -> focus only on what is important. Does it require specific knowledge from the user?
2. Divide and conquer -> Does it find and isolate the different problems? Is it solving them them separately?
3. Should not abstract because someone would probably someday eventually need to extend "this" with "that". Simpler design is much more flexible than over abstracted complex design.

## One more thing!

Mastery of abstraction depends on the ability to articulate ideas!

## Further reading

Good articles on abstraction (in order of my preference):

- [The law of leaky abstractions](https://www.joelonsoftware.com/2002/11/11/the-law-of-leaky-abstractions/)
- [Too much abstraction](https://wiki.c2.com/?TooMuchAbstraction)
- [Do the simplest thing that could possibly work](https://wiki.c2.com/?DoTheSimplestThingThatCouldPossiblyWork)
- [The wrong level of abstraction](https://blog.codinghorror.com/the-wrong-level-of-abstraction/)
- [Caught in a bad abstraction](https://medium.com/ni-tech-talk/caught-in-a-bad-abstraction-55bfe6634b83)
- [How to use abstraction](https://www.netguru.com/blog/how-use-abstraction-programming)

Intel docs:

- [Loop blocking](https://software.intel.com/content/www/us/en/develop/articles/how-to-use-loop-blocking-to-optimize-memory-use-on-32-bit-intel-architecture.html)
- [Optimize DS memory use](https://software.intel.com/content/www/us/en/develop/articles/how-to-manipulate-data-structure-to-optimize-memory-use-on-32-bit-intel-architecture.html)
- [Architectures Optimization Manual](https://software.intel.com/content/dam/develop/external/us/en/documents/64-ia-32-architectures-optimization-manual-144353.pdf)
