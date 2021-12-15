<script>
import Layout from "../../layouts/main";
import PageHeader from "@/components/page-header";
import appConfig from "@/app.config";

/**
 * Checkout component
 */
export default {
  components: { Layout, PageHeader },
  page: {
    title: "Checkout",
    meta: [
      {
        name: "description",
        content: appConfig.description,
      },
    ],
  },
  data() {
    return {
      title: "",
      items: [
        {
          text: "Ecommerce",
        },
        {
          text: "Checkout",
          active: true,
        },
      ],
    };
  },
  middleware: "authentication",
};
</script>

<template>
  <Layout>
    <PageHeader :title="title" :items="items" />
    <div class="row">
      <div class="col"></div>
      <div class="col">
        <div>
          Tebrikler !
        </div>
        <div>
          Profiliniz başarıyla oluşturuldu.
        </div>
      </div>
      <div class="col"></div>
    </div>
   
  </Layout>
</template>
