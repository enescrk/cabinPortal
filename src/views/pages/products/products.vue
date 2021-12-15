<script>
import Layout from "../../layouts/main";
import PageHeader from "@/components/page-header";
import appConfig from "@/app.config";
import axios from "axios";
/**
 * Orders component
 */
export default {
  components: { Layout, PageHeader },
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
      brandId: null,
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
     this.getBrandId(),
    this.fetchData();
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
     getBrandId(){
      this.brandId = localStorage.getItem('brandId')
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
          `https://cabinfit.dev-cabin.com/panel/Product?Brand=${this.brandId}&Page=${
            this.currentPage
          }&PageSize=${this.perPage}${
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
  },
};
</script>

<template>
  <Layout>
    <PageHeader :title="title" :items="items" />
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
          <button type="button" class="btn btn-success mb-3">
            <i class="mdi mdi-plus me-1"></i> Yeni Ürün Ekle
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
