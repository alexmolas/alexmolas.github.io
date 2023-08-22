---
layout: post
title: "How far can you jump from a swing?"
description: "In this post I derive the physics of pumping a swing and the physics of jumping from a swing. Then, using both pieces I compute the optimal strategy of jumping from a swing to maximize the traveled distance. I propose this game as a new Olympic sport."
tags: math stats
---

This summer I've spent an absurd amount of time reading and learning about the physics of swings. Yes, you read it right, I've been learning about the physical processes that happen when a kid is playing with a swing in the park. Blame it on my kids and the countless hours spent enjoying these moments with them. In particular, I read about the physics of pumping a swing and about the physics of jumping from a swing. Amidst my deep dive into swing physics, I came up with a new Olympic sport in which you start seated on a swing with length $L$, your feet comfortably touching the ground. As a countdown of $T$ seconds commences, you embark on the art of swing-pumping. Your challenge is to execute a skillful leap before the countdown reaches zero. With your jump, you travel a distance $d$ from your initial point, aiming to achieve the greatest possible $d$.

The question is then, which is the best method to maximize $d$? 

Before I present you with the answer to the question I'll summarize the learnings I got from reading about the physics of a swing. As usual, you can find all the code I used for this post in my repo.

<figure>
  <img src="/docs/swing/swing_drawing.png" alt="Swing Drawing" width="300" class="center" />
  <figcaption class="center">I love this image, and I wish more papers had this kind of picture on them. Image from [^2]</figcaption>
</figure>


# Pumping a swing

There are several papers about the pumping of a swing [^1], [^2], and [^3] and much more. In this section, I'll focus in particular on [^2]. 

The model for a swing I'll use is a rigid dumbbell made up of three masses, suspended by a rigid rod of length $l_1$ attached to the middle mass $m_1$. The distances from $m_1$ to the other masses $m_2$ and $m_3$ are $l_2$ and $l_3$ respectively. The angle of the rod $l_1$ with the vertical is $\phi$ and the angle of the dumbbell with the rod is $\theta$. In the next figure, you can see a diagram of the system

<figure>
  <img src="/docs/swing/swing_diagram.png" alt="Swing diagram" width="500" class="center" />
</figure>


The Lagrangian of this system is 

$$
\begin{align}
\mathcal{L} = & \frac{1}{2} I_1 \dot\phi^2 + \frac{1}{2} I_2 \left(\dot\phi + \dot\theta\right)^2 - l_1 N \dot\phi\left( \dot \phi + \dot\theta \right) \cos \theta \\
&+ M l_1 g \cos \phi - N g \cos\left(\phi + \theta\right)
\end{align}
$$

where $M = m_1 + m_2 + m_3$, $N = m_3 l_3 - m_2 l_2$, $I_1 = M l_1^2$, and $I_2 = m_2 l_2^2 + m_3 l_3^2$. Therefore, the Lagrange's equation for $\phi$ is

$$
\begin{align}
(I_1 + I_2) \ddot \phi + M l_1 \sin \phi = & -I_2 \ddot \theta - l_1 N \dot\theta^2 \sin \theta \\
& + l_1 N \dot\theta^2 \cos \theta + N g \sin(\phi + \theta) \\
& - 2 l_1 N \dot \theta \dot \phi \sin \theta \\
& + 2l_1 N \ddot \phi \cos \theta
\end{align}
$$

The paper proceeds by assuming the swinger pumps the swing by forcing $\theta(t) = \theta_0 \cos(\omega t)$, where $\omega$ is the natural angular frequency of the pendulum. Then, they show that there are two regimes, one where $\phi < \phi_{\text{crit}}$ where the movement is like an harmonic driven oscillator, and another one where $\phi > \phi_{\text{crit}}$ where the movement is an harmonic oscillator with parametric terms. They then analyze the different regimes and solve their equations. In summary, they show that for small amplitudes the swing follows the equation

$$
\ddot \phi + \omega_0^2\phi = F \cos(\omega t)
$$

where

$$
\begin{align}
&\omega_0= K_0/I_0\\
&I_0=I_1 + I_2 - 2l_1 N (1 - \theta_0^2/4 )\\
&K_0=Ml_1g - Ng(1 - \theta_0^2/4)\\
&F=\theta_0 \left[ (\omega^2 I_2 + N(g - \omega_0^2l_1)(1 - \theta_0^2/8)\right]/I_0
\end{align}
$$

The differential equation has the solution

$$
\phi(t) = \left(\frac{F}{\omega_0^2 - \omega^2}\right)\left(\cos \omega t - \cos \omega_0t\right)
$$

which looks like for small $t$

<figure>
  <img src="/docs/swing/phi_t.svg" alt="phi(t)" width="500" class="center" />
  <figcaption class="center">Solution for $\phi(t)$, with $F=0.085$, $\omega=2.21$, $\omega_0=2.23$</figcaption>
</figure>

This solution is good enough for our approach since I assume $T$ to be small enough to avoid the swinger pumping the swing to big $\phi$ values.

# Jumping from a swing

Now let's study how should a swinger jumps from a swing to maximize the traveled distance. The analysis presented here is based on the work of Jasm Cole [^4] and Hiroyuki Shima [^5]. Notice that the naive solution of jumping at $\phi=\pi/4$ is not optimal. For instance, imagine a swing that oscillates in the range $\pm \pi/4$, then it's clear that jumping at $\pi/4$ is suboptimal since the swinger will start its flight with a speed of zero. 

<figure>
  <img src="/docs/swing/swing_jump.png" alt="Jumping from a swing" width="500" class="center" />
  <figcaption class="center">Diagram showing the situation just after jumping from the swing. Notice that instead of $h$ I'm using $l_1$. Image from [^4].</figcaption>
</figure>

Once you jump from the swing, the equations of motion for the horizontal and the vertical directions are

$$
\begin{cases}
x(t) = l_1 \sin \phi + v t\cos\phi \\
y(t) = l_1(1 - \cos \phi) + vt \sin \phi - \frac{1}{2}gt^2 
\end{cases}
$$

Now, we can compute the total flight time by solving $y(t_{\text{flight}})=0$ and then compute the flight distance as $d = x(t_{\text{flight}})$. The flight time is then

$$
t_{\text{flight}} = \frac{v\sin\phi \pm\sqrt{v^2\sin^2\phi+2gl_1(1-\cos\phi)}}{g}
$$

and the distance

$$
\begin{align}
d = & l_1 \sin\phi + \frac{v^2 \sin\phi\cos\phi}{g} \\
& \pm \sqrt{\frac{2l_1v^2\cos^2\phi(1-\cos\phi)}{g}+\left(\frac{v^2\sin\phi\cos\phi}{g}\right)^2}
\end{align}
$$

Notice that the square root has two roots, both with physical meaning. I'll use the positive root when jumping forwards and the negative one when jumping backward.

# Putting everything together

We have now all the pieces we need to solve the problem. On one hand, we can compute the swinger angle $\phi$ for any given $t$, and we can also compute the distance that the swinger will travel when leaving the swing at an angle $\phi$. 

Notice that to compute $d$ we need to know $v$. In other sources that study this problem, they get $v$ by using energy conservation, however, in our case, we know $\phi(t)$ and we can get the initial velocity after leaving the swing as $v(t) = l_1 \frac{d}{dt} \phi(t)$ 

$$
v(t) = \frac{l_1F}{\omega^2_0 - \omega^2}(\omega\cos\omega t - \omega_0\cos \omega_0 t)
$$

Now, putting everything together we have this set of equations

$$
\begin{cases}
d(t) =l_1 \sin\phi(t) + \frac{v^2 \sin\phi(t)\cos\phi(t)}{g} \pm \sqrt{\frac{2l_1v^2\cos^2\phi(t)(1-\cos\phi(t))}{g}+\left(\frac{v(t)^2\sin\phi(t)\cos\phi(t)}{g}\right)^2} \\

\phi(t) = \frac{F}{\omega_0^2 - \omega^2}\left(\cos \omega t - \cos \omega_0t\right) \\

v(t) = \frac{l_1F}{\omega^2_0 - \omega^2}(\omega\cos\omega t - \omega_0\cos \omega_0 t)
\end{cases}
$$

To compute $d(t)$ we just need to compute $\phi(t)$ and $v(t)$ and substitute the values in the first equation. I'll use the same constants as in [^2]: $M=1$, $m_1=0.4M$, $m_2 = 0.2M$, $m_3 = 0.4M$, $l_1 = 2$, $l_2 = 0.4$, $l_3 = 0.4$, $\theta_0=0.7$, $g= 9.8$, $T=2 \pi \sqrt{l1 / g}$, and $\omega= 2\pi/T$

With these parameters, we can now plot the traveled distance as a function of the jumping time.

<figure>
  <img src="/docs/swing/distance_vs_t.svg" alt="Traveled distance as a function of jumping time" width="500" class="center" />
</figure>

Let's remember that we're interested in the optimal jumping time $t^\*$ for a given maximum time $T$. To do so we just need to fix a time $T$ and find at which $t^* < T$ the distance $d(t)$ is maximized. I did that numerically and plotted the results in the next image

<figure>
  <img src="/docs/swing/optimal_time.svg" alt="Optimal jumping time" width="500" class="center" />
</figure>

Of course, the optimal jumping time follows a ladder-like curve. This is because you're not interested in jumping backward, and sometimes it's better to jump some seconds before $T$ than to wait for $T$ and find yourself in a worse position.

Finally, we can get also the maximum traveled distance as a function of $T$.

<figure>
  <img src="/docs/swing/max_distance.svg" alt="Traveled distance as a function of jumping time" width="500" class="center" />
</figure>

For example, if $T=20s$, which seems like a reasonable value to make the sport interesting, one would expect to achieve $d=1m$. 

# Conclusion

Well, that's all for today. In this post, I've presented a new Olympic sport that consists of pumping on a swing during a given amount of time and then jumping and trying to achieve the maximum distance. With the parameters used in my simulations, I would expect the world record to be around one meter. 

The analysis presented here is full of simplifications. Here I list some of the ones I'm aware of

- The swinger model is oversimplified. For instance, authors in [^3] present a model which is more accurate than the one used here. However, I wanted to keep the analysis "simple".
- The distance between the swinger and the floor at the lowest point is zero, which is of course false. In [^5] a new parameter $r$ is added to account for that distance.
- The swinger is assumed to operate in the regime of small $\phi$, which allows us to use an analytical equation for $\phi(t)$. However, an experimented swinger could achieve big oscillation angles in a short amount of time, and then our simplification wouldn't be valid anymore.
- As a good physicist I've neglected any kind of friction (swing-rod, swinger-air, etc.). 

Even with all this simplification, I think the analysis stills bring some light to the problem of maximizing the flight distance. Now, the only step still missing is the experimental one: go to a park and try to beat the theoretical maximum distance. According to my numbers, you wouldn't be able to beat the 1-meter mark. 

All of this reminds me of the anecdote of the mathematician and his wife moving a sofa. The mathematician spent a lot of time computing if it was possible to move the sofa from one room to the other, and finally proved it was impossible. Then he went to show it to his wife, which had already moved the sofa to the other room. So I'm pretty sure that it's going to be possible to beat my theoretical maximum distance. Unfortunately, I don't have a swing near me right now, so I'll have to wait until the next visit to the park.

---

[^1]: Pumping on a Swing, Peter L. Tea and Harold Falk, American Journal of Physics, 36, 1165 (1968)
[^2]: The pumping of a swing from the seated position, William B. Case and Mark A. Swanson, American Journal of Physics, 58, 463 (1990)
[^3]: Initial phase and frequency modulations of pumping a playground swing, Chiaki Hirata et al, (2023)
[^4]: [https://jasmcole.com/2021/02/07/swing-and-a-miss/](https://jasmcole.com/2021/02/07/swing-and-a-miss/)
[^5]: [How far can Tarzan jump?, Hiroyuki Shima](https://arxiv.org/abs/1208.4355)
