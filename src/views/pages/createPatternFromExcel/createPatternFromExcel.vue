<script>
import Layout from "../../layouts/main";
import appConfig from "@/app.config";
import { Workbook } from "exceljs/dist/exceljs.min.js";
import axios from "axios";
// import moment from "moment";

export default {
  components: { Layout },
  page: {
    title: "Add Pattern With Excel",
    meta: [
      {
        name: "description",
        content: appConfig.description,
      },
    ],
  },
  data() {
    return {
      titlte: "",
      authStr: "Bearer 856706c3-b793-45c1-ab84-bb29d524c9d4",
      sendProductsModel: [],
      patterList: [],
      brandId: 1,
      selectedPattern: null,
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
    this.getBrandId();

    // Set the initial number of items
  },
  watch: {},
  methods: {
    getBrandId() {
      this.brandId = localStorage.getItem("brandId");
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
      var rows = [];
      worksheet.eachRow(function(row, rowNumber) {
        if (rowNumber > 1) rows = [...rows, row.values];
      });

      let patternNameList = [];
      // Unique kalıp isimlerini array içine atar
      rows.forEach((row) => {
        if (!patternNameList.includes(row[1])) {
          patternNameList.push(row[1]);
        }
      });

      let filteredPattern = [];
      let patternList = [];
      patternNameList.forEach((patternName) => {
        filteredPattern = rows.filter((x) => x[1] == patternName);

        let bodyPartList = [];
        let sizeList = [];
        let preferenceBodyPartList = [];
        let preferenceParameterModel = [];
        let categoryGenderModel = [];
        
        filteredPattern.forEach((element) => {
          if (element[7] > 0) bodyPartList.push({ Id: 1, Value: element[7] });

          if (element[8] > 0) bodyPartList.push({ Id: 2, Value: element[8] });

          if (element[9] > 0) bodyPartList.push({ Id: 3, Value: element[9] });

          // TODO: sizeId dinamik olarak metottan gelecek
          sizeList.push({ Id: element[6], Bodyparts: bodyPartList });
          bodyPartList = [];
        });

        // TODO: parametreler belirlenecek
        preferenceBodyPartList.push({ Id: 1, FitValue: 4, Weight: 1 });
        preferenceBodyPartList.push({ Id: 2, FitValue: 0, Weight: 1 });
        preferenceBodyPartList.push({ Id: 3, FitValue: 8, Weight: 1 });

        preferenceParameterModel.push({ Preference: preferenceBodyPartList, Bodyparts: preferenceBodyPartList });
        preferenceBodyPartList = [];

        // TODO: categoryGender dinamik olarak metottan gelecek
        categoryGenderModel.push({ CategoryGender: 22, PreferenceParameters: preferenceParameterModel, Sizes: sizeList });
        preferenceParameterModel = [];
        sizeList = [];

        patternList.push({ Name: patternName, Description: "", Brand: this.brandId, IsActive: true, CategoryGenders: categoryGenderModel });
        categoryGenderModel = [];
      });

      console.log(JSON.stringify(patternList));

     

      rows.forEach(
        async function(vals) {
          var productModel = {
            Brand: 1,
            Pattern: 1,
            Code: vals[1],
            Name: vals[2],
            CategoryGender: null, // TODO: Patternda döenen değer setlenecek
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
    saveMissingProp(index, type) {
      let selectedInputElem = this.sendProductsModel[index];
      selectedInputElem[type] = document.getElementById(
        `${type}-${index}`
      ).value;
    },
    saveProducts() {
      axios
        .post(
          "https://cabinfitapi.cabin.com.tr/panel/Product",
          this.sendProductsModel,
          {
            headers: { Authorization: this.authStr },
          }
        )
        .then(() => window.alert("Ürünler başarıyla eklendi"))
        .catch((error) => {
          this.errorMessage = error.message;
          console.error("There was an error!", error);
        });
    },

    controllDisablity() {
      let count = 0;
      if (this.sendProductsModel.length != 0) {
        this.sendProductsModel.forEach((element) => {
          if (!element.Code) {
            count++;
          }
          if (!element.Name) {
            count++;
          }
        });
        if (count == 0) {
          return false;
        } else {
          return true;
        }
      } else {
        return true;
      }
    },
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
        <form class="d-inline-flex mb-3">
          <label class="my-1 me-2" for="order-selectinput">Kalıp Seçimi</label>
          <select
            class="form-control"
            name="category"
            v-model="selectedPattern"
          >
            <option
              v-for="pattern in patterList"
              :key="pattern.Id"
              :value="pattern"
            >
              {{ pattern.Name }}
            </option>
          </select>
        </form>
        <label class="btn btn-success btn-file mx-auto">
          <i class="fas fa-table"></i>
          Dosya Seç
          <input
            type="file"
            style="display: none;"
            @change="previewFiles"
            required
          />
        </label>
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
              {{ selectedPattern.Name }}
            </td>
            <td>
              {{ prod.Code }}
              <span v-if="!prod.Code">
                <input
                  type="text"
                  v-bind:id="'Code-' + index"
                  placeholder="Ürün kodu girin"
                />
                <i
                  class="fas fa-check-square"
                  @click="saveMissingProp(index, 'Code')"
                ></i>
              </span>
            </td>
            <td>
              {{ prod.Name }}
              <span v-if="!prod.Name">
                <input
                  type="text"
                  placeholder="Ürün adı girin"
                  v-bind:id="'Name-' + index"
                />
                <i
                  class="fas fa-check-square"
                  @click="saveMissingProp(index, 'Name')"
                ></i>
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
              <i
                class="fas fa-trash"
                @click="deletProductByIndex(index)"
                style="cursor:pointer"
              ></i>
            </td>
          </tr>
        </table>
      </div>
      <div class="row">
        <button
          type="button"
          class="btn btn-success btn-lg btn-block"
          @click="saveProducts()"
          :disabled="controllDisablity()"
        >
          Kaydet
        </button>
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
