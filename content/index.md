![|550x128](logo.svg) {.logo .adaptive eleventy:ignore}

We are developing a logic-gated therapeutic platform—a protein-based system that acts like a molecular “computer.” It reads multiple antigenic inputs (e.g., A AND B, but NOT C) on the surface of immune cells and produces a single output: a conformational change that activates a therapeutic function only if all Boolean conditions are satisfied.

At the core is a modular adapter protein powered by engineered leucine zippers—coiled-coil switches that remain locked unless the full antigenic logic is met. Once unzipped, the adapter exposes a synthetic epitope (Fc fragment or antibody-binding domain), enabling precise engagement of an effector antibody or downstream immune effector.

---

## Lead user cases

:::::::::::: flex { .outer #and }
:::::: flex { .inner #and-text-2figs }

### AND gates & Primary Sclerosing Cholangitis (PSC)
PSC is driven by tissue-resident memory T cells (T~RM~) in the liver expressing CD69 and CXCR6. Our adapter is tuned to this dual-antigen signature, triggering therapeutic action only when both are co-expressed. Unlike standard antibodies, this design avoids damaging beneficial CD69⁺ or CXCR6⁺ populations found elsewhere in the body.

::: wrapper { #a-nb }
![](a-not-b.png)

![](a-not-b-text.svg) {.imgcaptions .adaptive eleventy:ignore}
:::

::: wrapper { #b-na }
![](b-not-a.png)

![](b-not-a-text.svg) {.imgcaptions .adaptive eleventy:ignore}
:::
::::::

::: wrapper { #a-b }
![](a-and-b.png)

![](a-and-b-text.svg) {.imgcaptions .adaptive eleventy:ignore}
:::
::::::::::::



:::::::::::: flex { .outer #not }
:::::: flex { .inner #not-text-fig }
### NOT gates & Secondary Progressive Multiple Sclerosis (SPMS)
Current SPMS therapies fail to selectively eliminate pathogenic T cells without broadly suppressing the immune system. Our system targets Th17.1-like CD4⁺ T cells—a steroid-resistant, neuroinflammatory population defined by CCR6 AND CD161, with optional NOT gates for markers like CD27.

::: wrapper { #a-b-c }
![](a-and-b-and-c.png)

![](a-and-b-and-c-text.svg) {.imgcaptions .adaptive eleventy:ignore}
:::
::::::

::: wrapper { #a-b-nc }
![](a-and-b-and-not-c.png)

![](a-and-b-and-not-c-text.svg) {.imgcaptions .adaptive eleventy:ignore}
:::
::::::::::::

### Antigenic biocomputers
Even the simplest logic adapters enable precise depletion of disease-driving cells while sparing regulatory and protective subsets —— and can be easily designed to treat a plethora of diseases, including Behçet’s disease, IBD, and inflammatory atherosclerosis. Yet we believe that the real potential of protein logic gates lies in their ability to be linked together to create complex logic circuits — biocomputers that detect pathogenic cells with extreme specificity.

Our ultimate goal is to create such antigenic biocomputers, first by developing AND & NOT gate mechanisms, then by testing their chimeras on disease models.

::: flex { #phases }
![](phase-1.svg) {eleventy:ignore}

![](phase-2.svg) {eleventy:ignore}

![](phase-3.svg) {eleventy:ignore}
:::

## Platform Advantages
- Boolean logic at the protein level: Enables conditionally activated therapy using AND / AND-NOT gates
- Single-protein architecture: Simplifies delivery, manufacturing, and regulatory approval
- Modular and reprogrammable: Adapter logic can be rapidly retargeted to new disease subsets
- Safer than bispecifics or CAR-T: Reduces off-target killing by requiring strict antigen logic fulfillment
- Cheaper than cell therapies: Fully recombinant format eliminates the need for cell extraction, engineering, or expansion—reducing cost, complexity, and manufacturing time.
