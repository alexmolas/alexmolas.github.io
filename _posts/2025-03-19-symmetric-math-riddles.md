---
layout: post
title: "Three symmetric math riddles" 
description: 
tags:
toc: false
---

I like problems that are easy to pose, and that seem difficult to solve at first glance, but that a slight change of perspective makes them simple and easy to solve. In this post, I will expose my 3 favorite problems of this type.

For each riddle, I’ll first explain the problem, then solve it the hard way, and finally show the elegant and simple solution. These three problems are widely known, so I’m sorry if you already know them.

# Two bikes and a fly

This is one of my favorite problems to ask at parties or social events [^1]. You can ask this question to anyone with basic math knowledge and they'll understand the question and the easy solution. And -in my experience- the more math you know the more you enjoy the trick used in the simple solution.

<div style="background-color: #e6f2ff; border: 1px solid #ccc; padding: 15px; margin-bottom: 20px;">
  <strong>Problem:</strong> Two cyclists start 30km apart and ride towards each other. Both cyclists travel at 5km/h. A fly starts on one cyclist's handlebar and flies towards the other cyclist. As soon as the fly reaches the other cyclist it goes back to the first one. The fly goes back and forth between them at 10km/h until they meet. What total distance does the fly travel?
</div>

<details>
<summary>Hard solution</summary>
The hard solution here involves summing the infinite sum. We'll calculate the distance the fly travels in each "leg" of its journey.
<ul>
  <li>On the first trip:
    <ul>
      <li>Cyclist and the fly will met after $10 t_1 = 30 - 5t_1 \implies t_1 = 2$. So in the first trip the fly travels $d_1 = 20km$</li>
      <li>Cyclists have traveled $10km$ each one, so now the distance between them is $10km$</li>
    </ul>
  </li>
  <li>On the second trip:
    <ul>
      <li>Now, the fly takes $10 t_2 = 10 - 5t_2 \implies t_2 = \frac{10}{15}$ and travels $d_2 = \frac{100}{15} km \approx 6.67 km$</li>
      <li>Cyclist traveled $\frac{50}{15}km$ and the distance between them is $10km - \frac{100}{15} \approx 3.33 km$</li>
    </ul>
  </li>
    <li>On the third trip:
    <ul>
      <li>Once again, $10 t_3 = \frac{10}{3} - 5t_3 \implies t_3 = \frac{10}{45}$ so the fly travels $d_3 = \frac{100}{45} km \approx 2.22km$</li>
      <li>...</li>
    </ul>
  </li>
  Here we notice the pattern that in each leg the distance that the fly moves is reduced by 3 (20, 6.67, 3.33, ...). Therefore, we have to solve for the infinite series $D = 20 + 20 / 3 + 20 / 3^2 + 20 / 3^3 + ...$ which can be solved by noticing that $D = 20 + D/3$ so $D = 30km$.
</ul>
</details>


<details>
<summary>Easy solution</summary>

To solve the problem you just neeed to know how long would it take for the cyclists to meet and the multiply this time by the speed of the fly.

<ul>
  <li>Time to meet = \frac{30 km}{10km/h} = 3h</li>
  <li>Distance traveled by the fly = $10 km/h \times 3h = 30km$</li>
</ul>

</details>

There's a funny story about this problem involving John von Neumann. Someone once asked von Neumann this question, expecting it to be challenging. To their surprise, von Neumann solved it almost instantly. The person who asked the question was disappointed and said, "Oh, I guess you figured out the quick trick to solve it!". Von Neumann, looking confused, replied, "What trick? I just added up the infinite series."


# Ants on a ruler

I don't remember when I first heard about this problem, but it was a long time ago - maybe during my Physics degree. I remember it was the first time when I smiled in awe after a math proof [^1].

<div style="background-color: #e6f2ff; border: 1px solid #ccc; padding: 15px; margin-bottom: 20px;">
  <strong>Problem:</strong> A 1-meter stick has 50 ants randomly placed on it, facing random directions. Ants move at 1 meter per minute. When they arrive at the end of the ruler they fall off at the ends. If two ants meet they reverse direction and keep moving. How long do you have to wait to be sure all the ants have fallen off?
</div>


<details>
<summary>Hard solution</summary>
In this case I wasn't able to get an analytics solution, so I decided to solve it with code. Here we'll simulate the ants for a couple of experiments and analyze the results.

{% highlight python %}
import random

def initialize_ants(n_ants=10, stick_length=1.0,):
    ants = [(random.uniform(0, stick_length), random.choice([-1, 1])) 
            for _ in range(n_ants)]
    return ants

def simulate_ants(ants, stick_length, ant_speed=1.0, dt=0.0001):
    # Initialize ants as (position, direction) tuples

    time = 0
    while ants:  # While there are ants still on the stick
        # Move all ants
        ants = [(pos + dir * ant_speed * dt, dir) for pos, dir in ants]
        
        # Handle collisions
        for i in range(len(ants)-1):
            for j in range(i+1, len(ants)):
                if abs(ants[i][0] - ants[j][0]) < 1e-7:
                    # Swap directions
                    ants[i] = (ants[i][0], -ants[i][1])
                    ants[j] = (ants[j][0], -ants[j][1])
        
        # Remove ants that fell off
        ants = [(pos, dir) for pos, dir in ants if 0 < pos < stick_length]
        
        time += dt

        if time > 1.:
            print(ants)
            break
    
    return time
{% endhighlight %}

If you run the below code for some iterations you can plot an histogram like the following one.

{% include image.html path="/docs/symmetric-math-riddles/ants-dist.png" caption="Time to fall distribution" width="300" %}

There you can see that the maximum amount of time the ants spend on the rule is 1 minute.

</details>


<details>
<summary>Easy solution</summary>

Here's the key insight: it doesn't matter if the ants bounce off each other when they collide. Since all ants look the same, we can pretend they just pass right through each other without changing direction. The only thing we care about is when the final ant drops off the ruler. And since each ant moves at 1 meter per second along a 1-meter ruler, we know that after exactly 1 minute, every ant must have reached one end or the other and fallen off.

</details>


# Boarding a plane

<div style="background-color: #e6f2ff; border: 1px solid #ccc; padding: 15px; margin-bottom: 20px;">
  <strong>Problem:</strong> A plane with 100 seats is boarding. The first passenger boards and sits randomly in one of the 100 seats. Each subsequent passenger boards and takes their assigned seat, but if their seat is already occupied by someone who sat randomly, they occupy a random empty seat instead.
</div>


<details>
<summary>Hard solution</summary>
Let's solve this rigorously by calculating the probabilities. Let's denote by f(n) the probability that the last passenger gets their assigned seat in a plane with n seats.

<h3>1. Initial Probabilities</h3>
<p>When passenger 1 boards, they can:</p>
<ul>
    <li>Sit in their own seat (seat 1) with probability $1/n$</li>
    <li>Sit in the last seat (seat n) with probability $1/n$</li>
    <li>Sit in any other seat $i$ ($2 \leq i \leq n-1$) with probability $(n-2)/n$</li>
</ul>

<h3>2. Case Analysis</h3>
<div class="case">
    <h4>Case A: Passenger 1 sits in seat 1</h4>
    <ul>
        <li>Everyone else will get their assigned seat</li>
        <li>Contribution to $f(n)$ is $(1/n) \times 1 = 1/n$</li>
    </ul>
</div>

<div class="case">
    <h4>Case B: Passenger 1 sits in seat n</h4>
    <ul>
        <li>The last passenger can't sit in their seat</li>
        <li>Contribution to $f(n)$ is $(1/n) \times 0 = 0$</li>
    </ul>
</div>

<div class="case">
    <h4>Case C: Passenger 1 sits in seat $i$ ($2 \leq i \leq n-1$)</h4>
    <ul>
        <li>When passenger $i$ arrives, they'll choose randomly among remaining seats</li>
        <li>This creates the same scenario as with $n-1$ seats</li>
        <li>Contribution to $f(n)$ is $((n-2)/n) \times f(n-1)$</li>
    </ul>
</div>

<h3>3. Mathematical Formulation</h3>
<p>Putting it all together:</p>
$$
    f(n) = \frac{1}{n} + \frac{n-2}{n} f(n-1)
$$

<h3>4. Solving the Recurrence</h3>
<ul>
    <li>Base case: For $n = 2$, $f(2) = 1/2$ (trivial to verify)</li>
    <li>Assume $f(n-1) = 1/2$ for some $n \geq 3$</li>
    <li>Then: $f(n) = 1/n + (n-2)/n \times  1/2$</li>
    <li>Simplifying: $f(n) = 1/n + (n-2)/(2n) = (2 + n-2)/(2n) = n/(2n) = 1/2$</li>
</ul>

<h3>5. Conclusion</h3>
<p>By induction, $f(n) = 1/2$ for all $n \geq 2$</p>
</details>


<details>
<summary>Easy solution</summary>

The easy solution consists in making a slight change of perspective: when a new passenger arrives and finds their seat occupied, the passenger asks the occupier to move and choose another seat at random. Before we were following what happens to each passenger, but now we can focus only on the first passenger, who is the only one choosing seats randomly. This way we can see that the first passenger will keep being moved around until only two seats remain: seat 1 and seat 100. At this point, the first passenger will choose randomly between these two seats, giving a 50% probability that the last passenger gets their assigned seat.
</details>

---

[^1]: The second time was during Cantor's diagonal proof.