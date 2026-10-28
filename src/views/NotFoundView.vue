<script setup></script>

<template>
  <section class="state-page">
    <div class="wrap">
      <span class="code mono">404</span>
      <h1>This page has gone off-grid.</h1>
      <p class="note" style="max-width:48ch">
        The page you're looking for doesn't exist, or it may have moved. Try one of these instead.
      </p>
      <div class="state-actions">
        <router-link class="btn btn-primary btn-pill pressable" to="/">Back to Home</router-link>
        <router-link class="btn btn-ghost btn-pill pressable" to="/services">View services</router-link>
      </div>
    </div>
  </section>
</template>
