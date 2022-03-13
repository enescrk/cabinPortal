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
      patternList: [],
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

        this.patternList.push({ Name: patternName, Description: "", Brand: this.brandId, IsActive: true, CategoryGenders: categoryGenderModel });
        categoryGenderModel = [];
      });
      console.log(this.patternList)
    },

    savePattern() {
      axios
        .post(
          "https://cabinfitapi.cabin.com.tr/panel/Patterns",
          this.patternList,
          {
            headers: { Authorization: this.authStr },
          }
        )
        .then((res) => res.isSuccess ? window.alert("Kalıplar başarıyla eklendi") : window.alert("Kalıplar yüklenirken hata oluştu."))
        .catch((error) => {
          this.errorMessage = error.message;
          console.error("There was an error!", error);
        });
    },

    controllDisablity() {
      return false
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
      <div class="row" v-if="patternList.length == 0">
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

      <div class="row productList" v-if="patternList.length > 0">
        <table>
          <tr>
            <th>#</th>
            <th>Adı</th>
            <th>Açıklama</th>
            <th>CategoryGender</th>
          </tr>
          <tr v-for="(pattern, index) in patternList" :key="pattern.id">
            <td>
              {{ index + 1 }}
            </td>
            <td>
              {{ pattern.Name }}
            </td>
            <td>
              {{ pattern.Description }}
            </td>
            <td>
              {{ pattern.CategoryGenders[0].CategoryGender }}
            </td>
          </tr>
        </table>
      </div>
      <div class="row">
        <button
          type="button"
          class="btn btn-success btn-lg btn-block"
          @click="savePattern()"
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
