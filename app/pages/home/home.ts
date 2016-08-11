import {Component} from '@angular/core';

import {NavController, AlertController} from 'ionic-angular';
import {BarcodeScanner} from 'ionic-native';

import {OFFService} from '../../services/OFF';
import {DetailsPage} from '../details/details';
import {CategoryPage} from '../category/category';

@Component({
  templateUrl: 'build/pages/home/home.html',
  providers: [OFFService]
})
export class HomePage {
  public foundProduct;
  public productCode;
  public categoryName = "pizza";
  public foundCategories;

  constructor(private openFoodFacts: OFFService,
              private nav: NavController,
              private alertController: AlertController) {
  }

  getProduct(productCode, callback: (product) => any = null) {
    this.openFoodFacts.getProduct(productCode).subscribe(
      data => {
        let json = data.json();

        if (json.status != 1) {
          this.alertController.create({
            title: "Produit non trouvé",
            subTitle: `Le code ${productCode} ne correspond à aucun produit`,
            buttons: ['OK']
          }).present();
          return;
        }
        if (callback) {
          callback(json.product);
        } else {
          this.foundProduct = json.product;
        }
      },
      err => {
        this.alertController.create({
          title: "Erreur de recherche",
          subTitle: "Une erreur est survenue lors de la recherche du produit. Vérifiez votre connexion Internet et rézssayez",
          buttons: [
            {
              text: "Réessayer",
              handler: this.getProduct(productCode)
            },
            {
              text: "OK"
            }
          ]
        })
      }
    );
  }

  getCategories() {
    this.openFoodFacts.getCategory(this.categoryName).subscribe(
      data => {
        const json = data.json();
        this.foundCategories = json.slice(0, 10);
      },
      err => console.log(err)
    )
  }

  scan() {
    BarcodeScanner.scan()
      .then((result) => {
        if (!result.isCancelled) {
          this.getProduct(result.text, (product) => {
            this.viewProductDetails(product);
          });
        }
      })
      .catch((err) => {
        alert(err);
      })
  }


  viewProductDetails(product) {
    this.nav.push(DetailsPage, {product: product});
  }

  viewCategoryProducts(category) {
    this.nav.push(CategoryPage, {category: category});
  }
}
