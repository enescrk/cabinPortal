<script>
import Layout from "../../layouts/main";
import PageHeader from "@/components/page-header";
import appConfig from "@/app.config";

import "vue2-dropzone/dist/vue2Dropzone.min.css";
import "vue-multiselect/dist/vue-multiselect.min.css";
import axios from "axios";
import Multiselect from "vue-multiselect";
/**
 * Add-product component
 */
export default {
  page: {
    title: "Kalıp Ekle",
    meta: [
      {
        name: "description",
        content: appConfig.description,
      },
    ],
  },
  components: {
    Layout,
    PageHeader,
    Multiselect,
  },
  mounted() {
    this.getBrandId(),
    this.getSizes();
  },
  data() {
    return {
      brandId: null,
      baseUrl: "https://cabinfit.dev-cabin.com",
      authStr: "Bearer 856706c3-b793-45c1-ab84-bb29d524c9d4",
      showTable : false,
      sizes: [],
      selectedSizes: [],
      selectedGender: null,
      selectedCategoryGender: null,
      genders: [
        {
          name: "Kadın",
          value: "KADIN",
        },
        {
          name: "Erkek",
          value: "ERKEK",
        },
        
      ],
      categories:[],
      title: "Kalıp Ekle",
      items: [
        {
          text: "Ecommerce",
        },
        {
          text: "Add Product",
          active: true,
        },
      ],
      dropzoneOptions: {
        url: "https://httpbin.org/post",
        thumbnailWidth: 150,
        maxFilesize: 0.5,
        headers: {
          "My-Awesome-Header": "header value",
        },
      },
      value1: null,
      options: [
        "High Quality",
        "Leather",
        "Notifications",
        "Sizes",
        "Different Color",
      ],
      requestModel: {
        Name: "WHEREAREYOU",
        Description: "HERE",
        Brand: null,
        IsActive: true,
        CategoryGenders: [
          {
            CategoryGender: null,
            PreferenceParameters: [
              {
                Preference: 1,
                Bodyparts: [
                  {
                    Id: 1,
                    FitValue: 16,
                    Weight: 1,
                  },
                  {
                    Id: 2,
                    FitValue: 31,
                    Weight: 1.5,
                  },
                  {
                    Id: 3,
                    FitValue: null,
                    Weight: 1.5,
                  },
                ],
              },
            ],
            Sizes: [],
          },
        ],
      },

    };
  },

  methods: {
     getBrandId(){
      this.brandId = localStorage.getItem('brandId')
    },
    getSizes() {
      axios
        .get(`${this.baseUrl}/panel/Sizes?CategoryGenderId=${this.selectedCategoryGender}`, {
          headers: { Authorization: this.authStr },
        })
        .then((response) => (this.sizes = response.data))
        .catch((error) => {
          this.errorMessage = error.message;
          console.error("There was an error!", error);
        });
    },
    getCategories(event){
      console.log(event.target.value)
      axios
        .get(`${this.baseUrl}/panel/CategoryGenders?Gender=${event.target.value}&ParentCategory=ÜST GİYİM`, {
          headers: { Authorization: this.authStr },
        })
        .then((response) => (this.categories = response.data))
        .catch((error) => {
          this.errorMessage = error.message;
          console.error("There was an error!", error);
        });
    },
    addSizeModeltoRequestModel() {
      this.requestModel.Brand = this.brandId;
      this.requestModel.CategoryGenders[0].Sizes = [];
      this.requestModel.CategoryGenders[0].CategoryGender = this.selectedCategoryGender;
      this.selectedSizes.forEach((element) => {
        let sizeModel = {
    Id: null,
    Bodyparts: [
      {
        Id: 1,
        Value: null,
      },
      {
        Id: 2,
        Value: null,
      },
      {
        Id: 3,
        Value: null,
      },
    ],
  }
        sizeModel.Id = element.Id;
        this.requestModel.CategoryGenders[0].Sizes.push(sizeModel);
      });
      console.log(this.requestModel)
      this.showTable = true;
    },
    findSizeNameById(id){
      for (let index = 0; index < this.sizes.length; index++) {

        if(this.sizes[index].Id == id){
          console.log(this.sizes[index])
          return this.sizes[index].Name
        }
      }
    },
    save(){
        axios
        .post("https://cabinfit.dev-cabin.com/panel/Patterns?CategoryGenderId=24", this.requestModel, {
          headers: { Authorization: this.authStr },
        })
        .then(() => (window.alert("Kalıp Başarıyla Eklendi")))
        .catch((error) => {
          this.errorMessage = error.message;
          console.error("There was an error!", error);
        });
    }
  },
  middleware: "authentication",
};
</script>

<template>
  <Layout>
    <PageHeader :title="title" :items="items" />
    <div class="row">
      <div class="col-lg-12">
        <div id="addproduct-accordion" class="custom-accordion">
          <div class="card">
            <a
              href="javascript: void(0);"
              class="text-dark"
              data-toggle="collapse"
              aria-expanded="true"
              aria-controls="addproduct-billinginfo-collapse"
              v-b-toggle.accordion-1
            >
              <div class="p-4">
                <div class="media align-items-center">
                  <div class="me-3">
                    <div class="avatar-xs">
                      <div
                        class="avatar-title rounded-circle bg-soft-primary text-primary"
                      >
                        01
                      </div>
                    </div>
                  </div>
                  <div class="media-body overflow-hidden">
                    <h5 class="font-size-16 mb-1">Kalıp Bilgisi</h5>
                    <p class="text-muted text-truncate mb-0">
                      Kalıp hakkında genel bilgiler
                    </p>
                  </div>
                  <i
                    class="mdi mdi-chevron-up accor-down-icon font-size-24"
                  ></i>
                </div>
              </div>
            </a>

            <b-collapse
              data-parent="#addproduct-accordion"
              id="accordion-1"
              visible
              accordion="my-accordion"
            >
              <div class="p-4 border-top">
                <form>
                  <div class="mb-3">
                    <label for="productname">Kalıp Adı</label>
                    <input
                      id="productname"
                      name="productname"
                      type="text"
                      class="form-control"
                      v-model="requestModel.Name"
                    />
                  </div>
                  <div class="row">
                    <div class="col-lg">
                      <div class="mb-3">
                        <label for="manufacturername">Kalıp Açıklamsı</label>
                        <input
                          id="manufacturername"
                          name="manufacturername"
                          type="text"
                          class="form-control"
                          v-model="requestModel.Description"
                        />
                      </div>
                    </div>
                  </div>
                  <div class="row">
                    <div class="col-md-4">
                      <div class="mb-3">
                        <label class="control-label">Cinsiyet</label>
                        <select class="form-control select2" @change="getCategories($event)" v-model="selectedGender">
                          <option>Kategori</option>
                          <option
                            v-for="gen in genders"
                            :key="gen.id"
                            :value="gen.value"
                            >{{ gen.name }}</option
                          >
                        </select>
                      </div>
                    </div>
                    <div class="col-md-4">
                      <div class="mb-3">
                        <label class="control-label">Kategori</label>
                        <select class="form-control select2" v-model="selectedCategoryGender">
                          <option>Alt Kategori</option>
                          <option
                            v-for="cat in categories"
                            :key="cat.id"
                            :value="cat.Id"
                          >
                            {{ cat.Category }}</option
                          >
                        </select>
                      </div>
                    </div>
                    <div class="col-md-4">
                      <div class="mb-3" @click="getSizes()">
                        <label class="control-label">Bedenler</label>
                        <!-- <select class="form-control select2" multiple>
                          <option>Alt Kategori</option>
                          <option v-for="size in sizes" :key='size.Id'  value="EL">
                            <input type="checkbox" id="vehicle1" name="vehicle1" value="Bike">
                            {{size.Name}}</option>
                          
                        </select> -->
                        <multiselect
                          v-model="selectedSizes"
                          :options="sizes"
                          :multiple="true"
                          :close-on-select="false"
                          :clear-on-select="false"
                          :preserve-search="true"
                          placeholder="Pick some"
                          label="Name"
                          track-by="Id"
                          :preselect-first="true"
                        >
                          <template slot="Seçildi"
                            ><span class="multiselect__single"></span
                          ></template>
                        </multiselect>
                      </div>
                    </div>
                  </div>

                  <div class="row">
                    <button
                      type="button"
                      class="btn btn-success"
                      v-b-toggle.accordion-2
                      @click="addSizeModeltoRequestModel()"
                    >
                      Sonraki Aşama
                    </button>
                  </div>
                </form>
              </div>
            </b-collapse>
          </div>

          <div class="card">
            <a
              href="javascript: void(0);"
              class="text-dark collapsed"
              data-toggle="collapse"
              aria-expanded="false"
              aria-controls="addproduct-img-collapse"
              v-b-toggle.accordion-2
            >
              <div class="p-4">
                <div class="media align-items-center">
                  <div class="me-3">
                    <div class="avatar-xs">
                      <div
                        class="avatar-title rounded-circle bg-soft-primary text-primary"
                      >
                        02
                      </div>
                    </div>
                  </div>
                  <div class="media-body overflow-hidden">
                    <h5 class="font-size-16 mb-1">Kalıp Ölçüleri</h5>
                    <p class="text-muted text-truncate mb-0">
                      Kalıp Ölçülerini
                    </p>
                  </div>
                  <i
                    class="mdi mdi-chevron-up accor-down-icon font-size-24"
                  ></i>
                </div>
              </div>
            </a>

            <b-collapse
              id="accordion-2"
              accordion="my-accordion"
              data-parent="#addproduct-accordion"
            >
              <div class="p-4 border-top">
                <div class="table-responsive">
                  <table class="table table-bordered mb-0" v-if="showTable">
                    <thead>
                      <tr>
                        <th>#</th>
                        <th>Beden</th>
                        <th>Göğüs</th>
                        <th>Bel</th>
                        <th>Kalça</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr
                        v-for="size in requestModel.CategoryGenders[0].Sizes"
                        :key="size.Id"
                      >
                        <th scope="row">1</th>
                        <td>{{ findSizeNameById(size.Id) }}</td>
                        <td><input type="number" v-model="size.Bodyparts[0].Value"></td>
                        <td><input type="number" v-model="size.Bodyparts[1].Value"></td>
                        <td><input type="number" v-model="size.Bodyparts[2].Value"></td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </b-collapse>
          </div>
        </div>
      </div>
    </div>
    <div class="row mb-4">
      <div class="col text-end ms-1">
        <a href="#" class="btn btn-danger">
          <i class="uil uil-times me-1"></i> Cancel
        </a>
        <a @click="save()" class="btn btn-success ms-1">
          <i class="uil uil-file-alt me-1"></i> Save
        </a>
      </div>
      <!-- end col -->
    </div>
  </Layout>
</template>

<style>
input {
  border: 0;
}
</style>
