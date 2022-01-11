<script>
import Layout from "../../layouts/main";
import appConfig from "@/app.config";
import axios from "axios";
/**
 * Orders component
 */
export default {
  components: { Layout },
  page: {
    title: "Orders",
    meta: [
      {
        name: "description",
        content: appConfig.description,
      },
    ],
  },
  data() {
    return {
       authStr: "Bearer 856706c3-b793-45c1-ab84-bb29d524c9d4",
      brandId: null,
      showAddProductModal: false,
      patterList: [],
      productCodes:"",
      addProductModel: {
        "Brand": this.brandId,
        "Pattern": null,
        "Code": null,
        "Name": "",
        "CategoryGender": null,
        "Description": "",
        "IsActive": true
    },
      title: "Orders",
      items: [
        {
          text: "Ecommerce",
        },
        {
          text: "Orders",
          active: true,
        },
      ],
      orderData: [],
      totalRows: 100,
      currentPage: 1,
      perPage: 10,
      status: null,
      pageOptions: [10, 25, 50, 100],
      filter: null,
      filterOn: [],
      sortBy: "age",
      sortDesc: false,
      fields: [
        {
          key: "Id",
          label: "Ürün ID",
        },
        {
          key: "Name",
          sortable: true,
        },
        {
          key: "CreationDate",
          label: "Oluşturulma Tarihi",
        },
        {
          key: "Description",
          label: "Açıklama",
          sortable: true,
        },
        {
          key: "IsActive",
          label: "Durum",
          sortable: true,
        },
        {
          key: "Code",
          label: "Ürün Kodu",
          sortable: true,
        },
        {
          key: "Pattern",
          label: "Kalıp",
          sortable: true,
        },
      ],
    };
  },
  middleware: "authentication",
  computed: {
    /**
     * Total no. of records
     */
    rows() {
      //TODO: İstekte totalCount döndüğünde o setlenecek.
      return 50;
    },
  },
  mounted() {
    this.getBrandId(), this.fetchData(), this.getPatterns();
    // Set the initial number of items
  },
  watch: {
    perPage: function() {
      this.fetchData();
    },
    currentPage: function() {
      this.fetchData();
    },
    filter: function() {
      if (this.filter.length > 3) this.fetchData();
    },
    status: function() {
      this.fetchData();
    },
  },
  methods: {
    goToCreateProductWithExcel() {
      this.$router.push({
        path: "/addProductWithExcel",
      });
    },
    goToCreateProductWithXml() {
      this.$router.push({
        path: "/addProductWithXML",
      });
    },
    getBrandId() {
      this.brandId = localStorage.getItem("brandId");
    },
    /**
     * Search the table data with search input
     */
    onFiltered() {
      // Trigger pagination to update the number of buttons/pages due to filtering
      // this.totalRows = filteredItems.length;
      this.currentPage = 1;
    },
    fetchData() {
      const AuthStr = "Bearer 856706c3-b793-45c1-ab84-bb29d524c9d4";

      axios
        .get(
          `https://cabinfitapi.cabin.com.tr/panel/Product?Brand=${
            this.brandId
          }&Page=${this.currentPage}&PageSize=${this.perPage}${
            this.filter ? "&Code=" + this.filter : ""
          }${this.status ? "&IsActive=" + this.status : ""}`,
          { headers: { Authorization: AuthStr } }
        )
        .then((response) => {
          if (response.data.length >= 1) {
            this.setTable(response.data);
          } else {
            this.orderData = [];
          }
        })
        .catch((error) => {
          this.errorMessage = error.message;
          console.error("There was an error!", error);
        });
    },

    getPatterns() {
      const AuthStr = "Bearer 856706c3-b793-45c1-ab84-bb29d524c9d4";

      axios
        .get(
          `https://cabinfitapi.cabin.com.tr/panel/Brand/${this.brandId}/Patterns`,
          { headers: { Authorization: AuthStr } }
        )
        .then((response) => (this.patterList = response.data))
        .catch((error) => {
          this.errorMessage = error.message;
          console.error("There was an error!", error);
        });
    },
    setTable(response) {
      if (response) {
        response.forEach((element) => {
          let row = {
            Id: element.Id,
            Name: element.Name,
            CreationDate: element.CreationDate,
            Description: element.Description,
            IsActive: element.IsActive,
            Pattern: element.Pattern,
            Code: element.Code,
          };

          this.orderData.push(row);
        });
      } else {
        this.orderData = [];
      }
    },
    getPatternCategoryGender(id) {
      let selectedCategoryGender = null;
      const AuthStr = "Bearer 856706c3-b793-45c1-ab84-bb29d524c9d4";

      axios
        .get(`https://cabinfitapi.cabin.com.tr/panel/Patterns/${id}`, {
          headers: { Authorization: AuthStr },
        })
        .then((response) =>
          this.setModel(response.data.CategoryGenders[0].CategoryGender)
        )
        .catch((error) => {
          this.errorMessage = error.message;
          console.error("There was an error!", error);
        });

      return selectedCategoryGender;
    },

    setModel(catGender) {
      let sendArr = [];
      this.addProductModel["CategoryGender"] = catGender;
      this.addProductModel["Brand"] = this.brandId;
      this.productCodes.split("\n").forEach((element) => {
        this.addProductModel["Code"] = element;
        sendArr.push(this.addProductModel);
      });
      this.saveProducts(sendArr);
    },
    saveProducts(model) {
      axios
        .post("https://cabinfitapi.cabin.com.tr/panel/Product", model, {
          headers: { Authorization: this.authStr },
        })
        .then(() => window.alert("Ürünler başarıyla eklendi"))
        .catch((error) => {
          this.errorMessage = error.message;
          console.error("There was an error!", error);
        });
    },
  },
};
</script>

<template>
  <Layout>
    <div id="myModal" class="modal" v-if="showAddProductModal == true">
      <!-- Modal content -->
      <div class="modal-content">
        <div>
          <span class="close" @click="showAddProductModal = false"
            >&times;</span
          >
        </div>
        <div class="row">
          <form class="d-inline-flex mb-3">
            <label class="my-1 me-2" for="order-selectinput"
              >Kalıp Seçimi</label
            >
            <select
              class="form-control"
              name="category"
              v-model="addProductModel['Pattern']"
            >
              <option
                v-for="pattern in patterList"
                :key="pattern.Id"
                :value="`${pattern.Id}`"
              >
                {{ pattern.Name }}
              </option>
            </select>
          </form>
        </div>

        <div class="row mt-3">
          <div>
            Ürün Kodları
          </div>
          <textarea
            name="codes"
            cols="10"
            rows="5"
            v-model="productCodes"
          ></textarea>
        </div>
        <div class="row mt-3">
          <button
            type="button"
            class="btn btn-success btn-lg"
            @click="getPatternCategoryGender(addProductModel['Pattern'])"
          >
            Kaydet
          </button>
        </div>
      </div>
    </div>
    <div class="row">
      <div class="col-12">
        <div>
          <div class="float-end">
            <form class="d-inline-flex mb-3">
              <label class="my-1 me-2" for="order-selectinput">Ürünler</label>
              <select class="form-select px-4" v-model="status">
                <option value="">Hepsi</option>
                <option value="true">Aktif</option>
                <option value="false">Pasif</option>
              </select>
            </form>
          </div>
          <button
            type="button"
            class="btn btn-success mb-3"
            @click="showAddProductModal = true"
          >
            <i class="mdi mdi-plus me-1"></i> Yeni Ürün Ekle
          </button>
          <button
            type="button"
            class="btn btn-success mb-3 mx-2"
            @click="goToCreateProductWithExcel()"
          >
            <i class="mdi mdi-plus me-1"></i> Yeni Ürün Ekle Excel
          </button>
          <button
            type="button"
            class="btn btn-success mb-3"
            @click="goToCreateProductWithXml()"
          >
            <i class="mdi mdi-plus me-1"></i> Yeni Ürün Ekle XML
          </button>
        </div>
        <div
          class="table table-centered datatable dt-responsive nowrap table-card-list dataTable no-footer dtr-inline"
        >
          <div class="row">
            <div class="col-sm-12 col-md-6">
              <div id="tickets-table_length" class="dataTables_length">
                <label class="d-inline-flex align-items-center fw-normal">
                  Show&nbsp;
                  <b-form-select
                    v-model="perPage"
                    size="sm"
                    :options="pageOptions"
                  ></b-form-select
                  >&nbsp;entries
                </label>
              </div>
            </div>
            <!-- Search -->
            <div class="col-sm-12 col-md-6">
              <div
                id="tickets-table_filter"
                class="dataTables_filter text-md-end"
              >
                <label class="d-inline-flex align-items-center fw-normal">
                  Ara:
                  <b-form-input
                    v-model="filter"
                    type="Ürün Kodu"
                    placeholder="Ürün kodunun tamamı"
                    class=" form-control-sm ms-2"
                  ></b-form-input>
                </label>
              </div>
            </div>
            <!-- End search -->
          </div>
          <!-- Table -->

          <b-table
            table-class="table table-centered datatable table-card-list"
            thead-tr-class="bg-transparent"
            :items="orderData"
            :fields="fields"
            responsive="sm"
            :per-page="perPage"
            :current-page="currentPage"
            :sort-by.sync="sortBy"
            :sort-desc.sync="sortDesc"
            :filter="filter"
            :filter-included-fields="filterOn"
            @filtered="onFiltered"
          >
            <template v-slot:cell(Id)="data">
              <a href="javascript: void(0);" class="text-dark fw-bold">{{
                data.item.Id
              }}</a>
            </template>

            <template v-slot:cell(Name)="data">
              <a href="#" class="text-body">{{ data.item.Name }}</a>
            </template>
            <template v-slot:cell(Pattern)="data">
              <a href="#" class="text-body">{{ data.item.Pattern }}</a>
            </template>
            <template v-slot:cell(Code)="data">
              <a href="#" class="text-body">{{ data.item.Code }}</a>
            </template>
            <template v-slot:cell(CreationDate)="data">
              <a href="#" class="text-body">{{ data.item.CreationDate }}</a>
            </template>
            <template v-slot:cell(Description)="data">
              <a href="#" class="text-body">{{ data.item.Description }}</a>
            </template>
            <template v-slot:cell(IsActive)="data">
              <a href="#" class="text-body" v-if="data.item.IsActive == true"
                >Aktif</a
              >
              <a href="#" class="text-body" v-if="data.item.IsActive == false"
                >Pasif</a
              >
            </template>
          </b-table>
        </div>
        <div class="row">
          <div class="col">
            <div class="dataTables_paginate paging_simple_numbers float-end">
              <ul class="pagination pagination-rounded">
                <!-- pagination -->
                <b-pagination
                  v-model="currentPage"
                  :total-rows="rows"
                  :per-page="perPage"
                ></b-pagination>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  </Layout>
</template>

<style>
.modal {
  display: block;
  position: fixed; /* Stay in place */
  z-index: 999999; /* Sit on top */
  padding-top: 100px; /* Location of the box */
  left: 0;
  top: 0;
  width: 100%; /* Full width */
  height: 100%; /* Full height */
  overflow: auto; /* Enable scroll if needed */
  background-color: rgb(0, 0, 0); /* Fallback color */
  background-color: rgba(0, 0, 0, 0.4); /* Black w/ opacity */
}

/* Modal Content */
.modal-content {
  background-color: #fefefe;
  margin: auto;
  padding: 20px;
  border: 1px solid #888;
  width: 80%;
}

/* The Close Button */
.close {
  color: #aaaaaa;
  float: right;
  font-size: 28px;
  font-weight: bold;
}

.close:hover,
.close:focus {
  color: #000;
  text-decoration: none;
  cursor: pointer;
}
</style>
