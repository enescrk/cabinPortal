<script>
import Layout from "../../layouts/main";
import appConfig from "@/app.config";
import { Workbook } from "exceljs/dist/exceljs.min.js";
import axios from "axios";

// import moment from "moment";

/**
 * Orders component
 */
export default {
  components: { Layout },
  page: {
    title: "Add Product With Excel",
    meta: [
      {
        name: "description",
        content: appConfig.description,
      },
    ],
  },
  data() {
    return {
      titlte:"",
      authStr: "Bearer 856706c3-b793-45c1-ab84-bb29d524c9d4",
      sendProductsModel: [],
      patterList: [],
      brandId: 1,
      selectedPattern: null,
      xmlInput: ""
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
    this.getPatterns();
    this.getBrandId();

    // Set the initial number of items
  },
  watch: {},
  methods: {
    getBrandId() {
      this.brandId = localStorage.getItem("brandId");
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
    readFile(targetData) {
      const workbook = new Workbook();
      const target = targetData;
      if (target.files.length !== 1) {
        throw new Error("Cannot use multiple files");
      }

      /**
       * Final Solution For Importing the Excel FILE
       */

      const arryBuffer = new Response(target.files[0]).arrayBuffer();
      return arryBuffer.then(function(data) {
        return workbook.xlsx.load(data).then(function() {
          return workbook.getWorksheet(1);
        });
      });
    },

    previewFiles(event) {
      //* Her yeni exceli üst üste eklemesini engeller.
      this.shipmentLines = [];

      this.readFile(event.target).then((res) => {
        this.handleExcelData(res);
      });
    },

    handleExcelData(worksheet) {
      console.log(this.selectedPattern);
      var rows = [];
      worksheet.eachRow(function(row, rowNumber) {
        if (rowNumber > 2) rows = [...rows, row.values];
      });

      rows.forEach(
        async function(vals) {
          var productModel = {
            Brand: 1,
            Pattern: this.selectedPattern.Id,
            Code: vals[1],
            Name: vals[2],
            CategoryGender: 24,
            Description: vals[3],
            IsActive: true,
          };

          this.sendProductsModel.push(productModel);
        }.bind(this)
      );
      console.log(this.sendProductsModel);
    },
    deletProductByIndex(index) {
      this.sendProductsModel.splice(index, 1);
    },
    setTransportType(type) {
      this.transportType = type;
    },
    saveMissingProp(index,type){
      let selectedInputElem = this.sendProductsModel[index];
      selectedInputElem[type] = document.getElementById(`${type}-${index}`).value;
    },
    saveProducts(){
      if(confirm(`${this.brandId} ID li marka için ${this.sendProductsModel.length} adet ürün eklenecek. Onaylıyor musunuz ?`)){
         axios
        .post("https://cabinfitapi.cabin.com.tr/panel/Product", this.sendProductsModel, {
          headers: { Authorization: this.authStr },
        })
        .then(() => window.alert("Ürünler başarıyla eklendi"))
        .catch((error) => {
          this.errorMessage = error.message;
          console.error("There was an error!", error);
        });
      }
     
    
    },
    fetchProducts(){
      eval(this.xmlInput)

    setTimeout(() => {
    this.sendProductsModel = JSON.parse(localStorage.getItem("productList"));
    this.sendProductsModel.forEach(element => {
      // debugger; // eslint-disable-line no-debugger
      element.Brand = this.brandId
    });
    
    localStorage.setItem("productList", JSON.stringify(this.sendProductsModel));
    }, 3000);
    }
  },
};
</script>

<template>

  <Layout>

    <div>
      <div class="row">
        <div class="information mb-3">
          Bu alanda ürün eklemek istediğiniz kalıbı ve ürün bilgilerinin yazılı
          olduğu excel dosyasını seçerek ürünlerinizi kaydedebilirsiniz.
        </div>
      </div>
      <div class="row" v-if="sendProductsModel.length == 0">
       <textarea cols="30" rows="10" v-model="xmlInput" placeholder="Minified script ekleyin"></textarea>
      </div>
      <div class="row my-3">
                <button type="button" class="btn btn-success btn-lg btn-block" @click="fetchProducts()">Çek</button>

      </div>

      <div class="row productList" v-if="sendProductsModel.length > 0">
        <table>
          <tr>
            <th>#</th>
            <th>Kalıp</th>
            <th>Ürün Kodu</th>
            <th>Ürün Adı</th>
            <th>Ürün Açıklaması</th>
            <th>Durum</th>
            <th>İşlem</th>
          </tr>
          <tr v-for="(prod, index) in sendProductsModel" :key="prod.Id">
            <td>
              {{ index + 1 }}
            </td>
            <td>
              Deneme
            </td>
            <td>
              {{ prod.Code }}
              <span v-if="!prod.Code">
                <input type="text" v-bind:id="'Code-' + index" placeholder="Ürün kodu girin">
                <i class="fas fa-check-square" @click="saveMissingProp(index,'Code')"></i>
              </span>
            </td>
            <td>
              {{ prod.Name }}
               <span v-if="!prod.Name">
                <input type="text" placeholder="Ürün adı girin" v-bind:id="'Name-' + index">
                <i class="fas fa-check-square" @click="saveMissingProp(index,'Name')"></i>
              </span>
            </td>
            <td>
              {{ prod.Description }}
            </td>
            <td>
              <span
                v-if="prod.Code && prod.Name"
                style="color:green; font-weight:600;font-size:10px"
              >
                Başarılı
              </span>
              <span
                v-if="!prod.Code || !prod.Name"
                style="color:red; font-weight:600;font-size:10px"
              >
                Ürün kodu ve ürün adı zorunludur. 
              </span>
            </td>
            <td>
              <i class="fas fa-trash" @click="deletProductByIndex(index)" style="cursor:pointer"></i>
            </td>
          </tr>
        </table>
      </div>
      <div class="row">
        <button type="button" class="btn btn-success btn-lg btn-block" @click="saveProducts()">Kaydet</button>
      </div>
      
    </div>
  </Layout>
</template>

<style>
.information {
  padding: 10px;
  text-align: center;
  background-color: red;
  color: white;
  border-radius: 5px;
}
table {
  font-family: arial, sans-serif;
  border-collapse: collapse;
  width: 100%;
}

td,
th {
  border: 1px solid #dddddd;
  text-align: center;
  padding: 8px;
}

tr:nth-child(even) {
  background-color: #dddddd;
}
.productList {
  max-height: 50vh;
  overflow: auto;
}
</style>
