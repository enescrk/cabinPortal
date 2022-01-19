<script>

export default {
  name: "home",
  components: {
    // HelloWorld
  },
  methods: {
    // Log the user in
    login() {
      this.$auth.loginWithRedirect();
    },
    // Log the user out
    logout() {
      this.$auth.logout({
        returnTo: window.location.origin,
      });
    },
  },
  mounted() {
    setInterval(() => {
      if (this.$auth.isAuthenticated) {
      let userModel = {
        email: this.$auth.user.email,
        token: null,
        username: this.$auth.user.nickname,
      };

      this.$auth.getTokenSilently().then((token) => {
        if (token) {
          userModel.token = token;
        }

        localStorage.setItem("user", JSON.stringify(userModel));
        this.$router.push(
          this.$route.query.redirectFrom || {
            path: "/",
          }
        );
      }),
        (error) => {
          console.log(error);
        };
    }
    }, 100);

   setTimeout(() => {
     this.login();    
   }, 1200);
          
    
    
  },
};
</script>

<template>
  <div class="home">

    <!-- Check that the SDK client is not currently loading before accessing is methods -->
    <div v-if="!$auth.loading">
    </div>
  </div>
</template>

<style lang="scss" module></style>
