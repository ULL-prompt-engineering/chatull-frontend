import Layout from '../layouts/Layout.astro';
import Card from '../components/Card.astro';

<Fragment>
<Layout title="Contact">
<main class="flex items-center my-20 gap-20 md:flex-row flex-col justify-center" {...{ "<div": true }}>
<Card href="" title="Phone" body="+34 622416076" />
<Card href="https://github.com/JonayVE-ull" title="Github" body="JonayVE-ull" />
<Card href="/contact" title="Email" body="alu0101398198@ull.edu.es" />
</main>
</Layout>


<style>

</style>
</Fragment>;
