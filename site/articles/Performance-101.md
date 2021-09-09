!{{
    "dateCreated": 1617015164565,
    "dateUpdated": 1617015164565,
    "pageTitle": "Performance 101",
    "tags": "[]",
    "id": "b0a8adc9-ff76-431a-9d7a-5d03d38816d4",
    "ready": false,
    "abstract": "As with the Abstraction 101, in this article I am going to go over foundational knowledge about software performance. I hope one could use it as a checklist or notes when they try to remind themselves something related to measuing performance of a software system."
}}

# Performance 101

- [Performance 101](#performance-101)
  - [What is performance?](#what-is-performance)
  - [What to measure](#what-to-measure)
    - [Availability](#availability)
    - [Response time](#response-time)
      - [Service time](#service-time)
      - [Wait time](#wait-time)
      - [Transmission time](#transmission-time)
    - [Channel capacity](#channel-capacity)
    - [Latency](#latency)
      - [Latency vs bandwidth vs throughput](#latency-vs-bandwidth-vs-throughput)
    - [Bandwidth](#bandwidth)
      - [Example 1](#example-1)
      - [Example 2](#example-2)
      - [Example 3](#example-3)
  - [How to measure](#how-to-measure)
    - [Testing types](#testing-types)
    - [Isolation testing](#isolation-testing)
    - [Load testing](#load-testing)
    - [Stress testing](#stress-testing)
    - [Soak testing](#soak-testing)
    - [Spike testing](#spike-testing)
    - [Breakpoint testing](#breakpoint-testing)
    - [Configuration testing](#configuration-testing)
    - [Internet testing](#internet-testing)
  - [Bonus tip](#bonus-tip)
  - [Tools](#tools)
  - [Summary](#summary)
  - [Further reading](#further-reading)

## What is performance?

Before anything useful could be said we should establish a few things!

**"Performance"** is the accomplishment of a given task measured against preset known standards of accuracy, quality, completeness, cost, and speed. Performance is an aspect of software quality.

**Performance improvement** is measuring the output of a particular business process or procedure then modifying the process or procedure to:

- increase the output
- increase efficiency
- increase the effectiveness of the process or procedure.

**Computer performance** is the amount of useful work accomplished by a computer system.

Outside of specific contexts, **computer performance** is estimated in terms of:

- Accuracy
- Efficiency
- Speed of executing computer program instructions

When it comes to high **computer performance**, one or more of the following factors could be involved:

- Short response time for a given piece of work.  
- High throughput (rate of processing work).
- Low utilization of computing resource(s).
- High availability of the computing system or application.
- Fast (or highly compact) data compression and decompression.
- High bandwidth.
- Short data transmission time.

In this post I am going to focus on foundational stuff and not discuss Google Web Vitals or TTFB and etc. The metrics I am going to cover are the foundation of all other metrics.

Example of the kind of performance we are interested in in this article: Fast speed of execution + Short response time. Improvement to these are going to bring improvements to TTFB. I hope this drives the point home... let's get to the important stuff.

## What to measure

1st you need to establish a baseline. This baseline is going to change over time as your knowledge of the system and what/how to measure increases. This is going to be the representation of the current state of the software system. It most probably is not going to be the place you want to be in terms of performance. This what you are going to use to measure your progress.

2nd you need to check for potential problems with aspects of the software system that could be described as slow.

Please keep in mind that all the metrics affect each other to some degree. I did my best to discuss them in isolation, but they seamlessly bleed between each other. I am going to try to point that out where I can.

From this point onward I am going to use an example system to help explain some of the metrics.

{TODO: add picture}

### Availability

What is availability?

Availability means the probability that a system is operational at a given time, i.e.,
the amount of time a service is operating as the percentage of total time it should be operating.

High-availability systems may report availability in terms of minutes or hours of downtime per year.

Let's say one of the services needed to generate the server response is slow or not responding... This degrades our application availability and reliability.

Availability could be the problem with any shared resource like DB.

If your queries are put in the queue and waiting...
Availability issues could be solved with different caching strategies, or by adding more of the scarce resource, change the communication model from pull to push.

Examples:
Add load balancer and more application servers
Add caching between server and MS
Add micro caching for specific requests with NGINX
Heavy inserts with additional service and fast write DB

### Response time

This is the amount of time it takes to generate response to a request. It could be IO operation... for example: reading cached assets from disk.

Response time is an aggregate of:
Service time
Wait time
Transmission time

#### Service time

How long it takes to do the work requested. When our application server gets a request, this is the time it needs to understand the request, prepare the response and start sending it to the requestee

#### Wait time

How long the request must wait for requests queued ahead of it before it gets to run. If we have 100 or 1000 … 1 mil requests ahead of ours…

Even if processing 1 request takes 1 ms, when you have 20 000 requests ahead of you this means yours is going to wait for 20 seconds just to be processed.

#### Transmission time

How long it takes to move the request to the computer doing the work and the respond back to the requestor.

Response time in complex application could include 100s of services. Keeping it low is in a large system is generally a feat of engineering.

Wait time and Transmission time could be addressed the same way we are addressing availability in most cases:

- Caching, micro-caching
- Adding more resources…

Service time is more interesting.

Let's say the 20 seconds for your transaction are coming from some dynamic content that is being taken out of a big data set.

Sounds realistic... Developer used some default search method which is not optimized for the use-case…

It takes time. Once you identify this as the source of the slowness, you should put a sprinkle of CS on the problem.

Understand if you can index the array in some way. Split into different collections and so on ...

### Channel capacity

That is an issue that is fairly hidden away from most developers somewhere deep in layers 1 to 4 of the OSI (Open Systems Interconnection) model.Layer 1: Physical Layer
Layer 2: Data Link Layer
Layer 3: Network Layer
Layer 4: Transport Layer
Layer 5: Session Layer
Layer 6: Presentation Layer
Layer 7: Application Layer
Channel capacity is the tight upper bound on the rate at which information can be reliably transmitted over a communication channel.
In areas like video streaming depending on the available bandwidth the streaming service could switch between variety of pre-defined image quality settings and continue the playback with lower resolution.

Or your channel may not be the Internet... An easy-to-understand problem with channel capacity is HDMI video standard.
The HDMI 2.1 standard defines channel capacity of 48 gigabits/sec. 1 x 8K 60 fps | 1 x 4K 120 fps … etc.
Like many video, audio and data cables, HDMI cords can suffer from signal degradation at longer lengths — 15 meters is generally considered the maximum reliable length. And it's rare to see an HDMI cable longer than 5 in a store.

If you are designing software that should work on mobile devices you should consider the channel capacity of the various mobile networks in the target market.

Back to our example.

Where do you think we could have issues with channel capacity? There are a few…

- Our third-party connection could be a bottleneck
- I/O is also a channel, the ability of our DB to write to drive/RAM is also limited by the technology (move from SSD to PCIex… NVMe… etc)
- The maximum amount of requests queue
- CWND and RWND
- Capacity of the ISPs between app server and client
- The data center internet connection could be a bottleneck -> highly unlikely but in my career, “I’ve seen things you people wouldn’t believe…”

### Latency

When we are discussing performance of an application, we need to be aware of few varieties of latency.

Latency is everywhere. Even this video is streamed with latency right now :D

The latency of our video is the time for the light to hit the camera lens, then to be digitized from the sensor, encoded to whatever video codec we are using, split into packages and send over the wire, when clients eventually get the packages, they need to combine the data, decode and display.

Latency is the time delays between cause and effect. Think of it like hitting the submit button of the login form and getting logged in. The definition of latency depends on the system in question. In terms of UX the perceived latency from the user’s interactions is one of the most critical things to optimize to improve your customers' satisfaction.

Depending on the type of latency one can approach the problem the same way as availability or implement a better UX.

In this talk I am going to focus on network latency!

There are five main components that affect network latency:

- Transmission medium: The physical path between the start point and the end point. The type of medium can impact latency. For instance, old copper cable-based networks have a higher latency than modern optic fibers.
- Propagation: The further apart two nodes are the more latency there is as latency is dependent on the distance between the two communicating nodes. Theoretically, latency of a packet going on a round trip across the world is 133ms. In actuality, such a round trip takes longer, though latency is decreased when direct connections through network backbones are achieved.
- Routers: The efficiency in which routers process incoming data has a direct impact on latency. Router to router hops can increase latency.
- Storage delays: Accessing stored data can increase latency as the storage network may take time to process and return information.
- Last mile delays: Eventually there is an ISP and their network between you and your client, which is unpredictable, especially when it looks like this…

#### Latency vs bandwidth vs throughput

The performance of your network and application depend on latency, bandwidth, and throughput, but it’s important not to confuse one with the other.
Bandwidth is the amount of data that can pass through a network at any given time. Consider bandwidth as how narrow or wide a pipe is. A wider pipe allows for more data to be pushed through. Throughput, on the other hand, is the amount of data that can be transferred over a given period.

An efficient network connection is comprised of low latency and high bandwidth. This allows for maximum throughput. The bandwidth can only be increased by a finite amount as latency will eventually create a bottleneck and limit the amount of data that can be transferred over time.

**Key Takeaways:**

- Latency is the time it takes for a data packet to travel from the sender to the receiver and back to the sender.
- High latency can bottleneck a network, reducing its performance.
- You can make your web applications less latent by using a CDN and a private network backbone to transfer data.

### Bandwidth

Maybe your application needs a lot of bandwidth to load in reasonable amount of time…

One could measure their web application or service in terms of bandwidth. Let's say that we are transferring a lot of resources for the page to load.

Maybe not all of them are needed for the initial screen but we still need to pay the price of downloading them. And the price is much higher than what most people think it is.

In computer networking, bandwidth is a measurement of bit-rate of available or consumed data communication resources, expressed in bits per second or multiples of it (bit/s, kbit/s, Mbit/s, Gbit/s, etc.).

When you try to download a resource from the Internet there are some delays related to the response time of the server. However, a big portion of the delays are happening on the network itself.

#### Example 1

If you have 100 gigabit link, you are not going to use its full potential to download a 50 KB image.

Best case scenario on a modern infra you will need at least 3 packets for this image to be transmitted to you.
This is not more than a 1,6 megabits saturated of the link.

This is because TCP congestion control algorithms doesn't allow you to overwhelm the network.

Packages by default start at 10 frames each of 1.46 K. So, a package is less than 14.6 KB when it starts.

Then there is ramp up algorithm until you hit package loss, then there is a back down formula that cuts your traffic and uses a more conservative ram up algorithm that puts you on a speed that is going to sit well with other users on the data link.
Remember this 100mbps are going over your ISPs link, its not like ISPs are overselling based on the assumption that users won’t user their maximum capacity at the same time :D

Bandwidth sometimes defines the net bit rate (aka. peak bit rate, information rate, or physical layer useful bit rate), channel capacity, or the maximum throughput of a logical or physical communication path in a digital communication system.

#### Example 2

Bandwidth tests measure the maximum throughput of a computer network.
The reason for this usage is that according to Hartley's law, the maximum data rate of a physical communication link is proportional to its bandwidth in hertz, which is sometimes called frequency bandwidth, spectral bandwidth, RF bandwidth, signal bandwidth or analog bandwidth.

Solving the bandwidth an app consumes can be addressed in couple of ways.

Easiest and fastest to give results is to move whatever you can onto a CDN. Bring the resources closer to the user – physically so that the bandwidth is spread and less is served from your origin.

Second thing is to start removing stuff you don't need to render the first load of the page. Give example with how Netflix attacked their homepage performance.

Another interesting example is to observe your communication protocols… Protobuf vs JSON comes to my mind as an example. 1.5MB of JSON are about 650KB of protobuf. So, you could halve the traffic you need to move.

#### Example 3

Packages with 14KB and 1KB sizes are transferred at the same speed. But one sprite with 7 image are going to be transmitted faster than 7 x 2KB images.

## How to measure

>If you can’t measure it, you can’t improve it… - Peter Drucker

Start by asking the right questions!

Performance specifications should ask the following questions, at a minimum:

- In detail, what is the performance test scope? What subsystems, interfaces, components, etc. are in and out of scope for this test?
- For the user interfaces (UIs) involved, how many concurrent users are expected for each (specify peak vs. nominal)?
- What does the target system (hardware) look like (specify all server and network appliance configurations)?
- What is the Application Workload Mix of each system component? (for example: 20% log-in, 40% search, 30% item select, 10% checkout).
- What is the System Workload Mix? [Multiple workloads may be simulated in a single performance test] (for example: 30% Workload A, 20% Workload B, 50% Workload C).
- What are the time requirements for any/all back-end batch processes (specify peak vs. nominal)?

Performance of a computer system is not constant. It depends on many variables and once measured it is accurate only in the context of the variables. Once the parameters change, we need to test again. Increasing hardware blindly could point your intuition towards feelings of improved performance, but it is just going to expose the next bottleneck in your system.

Methodology:

1. Identify the Test Environment.
2. Identify Performance Acceptance Criteria.
3. Plan and Design Tests.
4. Implement the Test Design.
5. Execute the Test.
6. Analyze Results, Tune, and Retest.

### Testing types

In theory they sound similar, that is because for the most part the methodology of execution is similar.

However, the devil is in the details… Let’s check each one of them, how it is performed and what is the goal of doing it.

- Isolation testing
- Load testing
- Stress testing
- Soak testing
- Spike testing
- Breakpoint testing
- Configuration testing
- Internet testing

Each one of them has its intricacies and needs time and practice to master!

### Isolation testing

Isolation testing is not unique to performance testing but involves repeating a test execution that resulted in a system problem.

Such testing can often isolate and confirm the fault domain.

It is important for efficient troubleshooting. You need the ability to replicate a faulty behavior in isolation so that you don’t need to spin up hundreds of components to verify your results.

### Load testing

Load testing is the simplest form of performance testing.

A load test is usually conducted to understand the behavior of the system under a specific expected load.

This load can be the expected concurrent number of users on the application performing a specific number of transactions within the set duration.

This test will give out the response times of all the important business critical transactions.

The database, application server, etc. are also monitored during the test, this will assist in identifying bottlenecks in the application software and the hardware that the software is installed on.

To turn back to the example: expected load for which system? How is our test going to change if we focus on another system?

### Stress testing

Stress testing is normally used to understand the upper limits of capacity within the system.

This kind of test is done to determine the system's robustness in terms of extreme load and helps application administrators to determine if the system will perform sufficiently if the current load goes well above the expected maximum.

What do we want to stress here?

Stress testing in isolation is also an option…

### Soak testing

Soak testing, also known as endurance testing, is usually done to determine if the system can sustain the continuous expected load.

During soak tests, memory utilization is monitored to detect potential leaks. Queues are monitored to see if requests/messages get dropped.

Also important, but often overlooked is performance degradation, i.e., to ensure that the throughput and/or response times after some long period of sustained activity are as good as or better than at the beginning of the test.

It essentially involves applying a significant load to a system for an extended, period.

The goal is to discover how the system behaves under sustained use.

### Spike testing

Spike testing is done by suddenly increasing or decreasing the load generated by a very large number of users and observing the behavior of the system.

The goal is to determine whether performance will suffer, the system will fail, or it will be able to handle dramatic changes in load. How resources are utilized, and then released.

Spike testing is interesting because it can be used to test multiple components of the infrastructure: load balancer, auto scaling, resource utilization bottlenecks (example: RAM is not enough for CPU to be fully loaded)

### Breakpoint testing

Breakpoint testing is similar to stress testing. An incremental load is applied over time while the system is monitored for predetermined failure conditions.

Breakpoint testing is sometimes referred to as Capacity Testing because it can be said to determine the maximum capacity below which the system will perform to its required specifications or Service Level Agreements.

The results of breakpoint analysis applied to a fixed environment can be used to determine the optimal scaling strategy in terms of required hardware or conditions that should trigger scaling-out events in a cloud environment.

### Configuration testing

Rather than testing for performance from a load perspective, tests are created to determine the effects of configuration changes to the system's components on the system's performance and behavior.

A common example would be experimenting with different methods of load-balancing:
Round Robin
Weighted Round Robin
Least connection
Weighted least connection
Resource based (Adaptive/SDN adaptive)
Fixed weighting
Response time
Source IP hash
URL Hash

Or how hardware specs could improve behavior of the system:
More RAM
Faster RAM
Faster CPU
Slower CPU but with more cores

Configuration testing should be verified in conjunction with other types of testing.

### Internet testing

This form of performance testing is when global applications such as Facebook, Google and Wikipedia, are performance tested from load generators that are placed on the actual target continent whether physical machines or cloud VMs. These tests usually requires an immense amount of preparation and monitoring to be executed successfully.

Alternatively, the so-called RUM monitoring could provide a lot of meaningful albeit varied data on the subject.

Let’s check this situation. The system we discussed so far is hosted in the red dot. Our services are used in countries all around.

Depending on where we want to grow our business, we need to identify how our SLAs hold in the markets we target.

Internet testing is expensive. If you try using some of the free tools, they will provide very vague and unreliable results for you.

Services like webpagetest and lighthouse are a good starting point, but their results should be taken with a grain of salt.

1st of all their servers are located somewhere, so there is a penalty to accessing your services or web pages.
2nd these tools cannot represent your actual users in terms of internet speed, hardware, frequency of access, etc.

Good internet testing means you are going to have access to a machine on location where you can perform the tests.

I remember a very interesting case with site slowness in the UK. While I was debugging it there were no indication of any possible issue. All system worked as expected. I had access to Catchpoint which provides the ability to execute tests in variety of locations, albeit data centers…
So … all tests' results were good, customers were still complaining. Eventually I got a setup to work with that matches one of the complaining customers. Laptop, ISP, internet plan, wifi, etc. At the time the product in question was using Google Cloud CDN to load variety of static resources.

What I observed on that machine is that DNS resolve for the static resources took between 2-3 seconds alone. So, there was issue with the ISP…
Well, the ISP doesn’t really care about your product, and customers don’t really care about your problems with ISP, neither are going change their ISP…

The remedy in this case was to test few CDN options with PoPs close to the customers, mirror our content and route this region to the new CDN.

RUM monitoring to he rescue…

Real user monitoring tools allow you to gather some metrics on how your services load and are perceived by the customers. While RUM is not going to sample 100% of your customers, you could still get a pretty good understanding of how your services are consumed and if withing parameters.

RUM testing is not perfect, there are a lot of knobs that need to be adjusted until you get trustworthy results and establish a baseline for the variety of your users’ locations.

## Bonus tip

Performance sometimes hides in unexpected places. If you focus only on code execution you are going to miss the big improvements that could be done onto a system.

Sometimes you needs to step back and see the system in context

Context could be many things:

- How the customers are using your software
- How it is delivered to them
- Context in terms of environment

## Tools

Custom tools are of course the best. You know your software best and know how to test it best. While it is expensive to develop them in the first place, eventually the payoff is larger.

For quick reaction however using one or more of the listed above could prove helpful and give you insights onto what is going on.

- Lighthouse
- Webpage test
- Catchpoint
- New Relic
- Dynatrace
- AppDynamics

## Summary

Testing the wrong things -> testing for loops and branches in the code very rarely produces meaningful results (except when they do  ). These are needed but are more on the side of micro-optimizations and tweaking rather than bringing massive improvements.

Expensive tests -> while soak testing sounds great, how could you perform it? Does it mean your software is going to inaccessible for the time being? Are you going to mirror your entire system to run a soak?

TTM -> sometimes performance troubleshooting takes time. Often the business would need a much faster reaction, thus one should know all the aspects of performance and variety of gains. Taking you back to the example with the slow ISP and DNS resolve times. It was expensive to setup the mirror and re-route the traffic. But it was cheap comparing to the business that we were losing to faster competitors.

Narrow field of view -> it is very hard to produce good performance if your understanding of the system is limited

Forget about performance -> once a good result is obtained it is very easy to stop worrying about performance. But it degrades over time and it requires constant effort to keep up to spec.

Impossible standard -> while your software grows its SLAs would have to adjust to meet the new requirements. If a transaction used to take 1ms and it triples in size and complexity this number could no longer be achievable.

Infinitely fast = infinitely expensive

Establish baseline -> current picture

Define the numbers -> where you want to go

TTM is important -> Don’t forget the business

Performance hides in unexpected places -> parsing speed vs downloading speed, searching vs indexing, data structures (array vs hash table vs map)

Ask the right questions:
In detail, what is the performance test scope? What subsystems, interfaces, components, etc. are in and out of scope for this test?
For the user interfaces (UIs) involved, how many concurrent users are expected for each (specify peak vs. nominal)?
What does the target system (hardware) look like (specify all server and network appliance configurations)?
What is the Application Workload Mix of each system component? (for example: 20% log-in, 40% search, 30% item select, 10% checkout).
What is the System Workload Mix? [Multiple workloads may be simulated in a single performance test] (for example: 30% Workload A, 20% Workload B, 50% Workload C).
What are the time requirements for any/all back-end batch processes (specify peak vs. nominal)?

Expectation vs Reality -> testing hardware vs user hardware

Caching, and micro-caching

Micro-caching caps the number of requests reaching the origin server by having cache servers store content for very short periods of time.
News sites: The content is updated in an unpredictable manner as the news happens. In addition, the content may have to be updated as new comments are added.
Stock trading websites: The stock prices change frequently during trading and only remain static for a very short period. However, the prices remain static for longer durations during the night, weekends, holidays, and other times when there is no trading.
Sports score websites: The number of scores and time of scoring are usually unpredictable and the results should be updated every time a team scores.

Micro-caching is an effective method for accelerating the delivery of “dynamic,” non-personalized website content without compromising the end user experience. In most cases, micro-caching is only suitable for the data that does not affect the operations, integrity, or security of the processes.
It ensures that, when the web page or site is under heavy load, most of the visitors get a copy of the page served from the static content cache rather than the origin server. The process reduces the load on the server and improves the overall performance of the website.

## Further reading

- [High Performance Browser Networking](https://hpbn.co/)
- [Web.dev](https://web.dev/)
- [Addy Osmani](https://medium.com/@addyosmani)
- [Netflix case study](https://medium.com/dev-channel/a-netflix-web-performance-case-study-c0bcde26a9d9)
- [HTTP 203](https://www.youtube.com/playlist?list=PLNYkxOF6rcIAKIQFsNbV0JDws_G_bnNo9)
- [Jake Archibald](https://jakearchibald.com/)
- [Chrome devtools](https://developers.google.com/web/tools/chrome-devtools)
- [Pshychology of waiting](https://blog.mercury.io/the-psychology-of-waiting-loading-animations-and-facebook/)
- [UX and FE performance](https://alistapart.com/article/improving-ux-through-front-end-performance/)
