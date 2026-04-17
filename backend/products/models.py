from django.db import models
import qrcode
from io import BytesIO
from django.core.files import File


class Category(models.Model):
    name = models.CharField(max_length=100)

    def __str__(self):
        return self.name


class Brand(models.Model):
    name = models.CharField(max_length=100)

    def __str__(self):
        return self.name


class Product(models.Model):

    name = models.CharField(max_length=200)
    brand = models.ForeignKey(Brand, on_delete=models.CASCADE)
    category = models.ForeignKey(Category, on_delete=models.CASCADE)

    description = models.TextField()

    price = models.DecimalField(max_digits=10, decimal_places=2)

    is_active = models.BooleanField(default=True)

    qr_code = models.ImageField(upload_to="qr_codes/", blank=True, null=True)

    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.name


    def generate_qr_code(self):

        qr_data = f"http://localhost:3000/products/{self.id}"

        qr = qrcode.make(qr_data)

        buffer = BytesIO()
        qr.save(buffer)

        filename = f"product_{self.id}.png"

        self.qr_code.save(filename, File(buffer), save=False)


    def save(self, *args, **kwargs):

        super().save(*args, **kwargs)

        if not self.qr_code:
            self.generate_qr_code()
            super().save(update_fields=["qr_code"])


class ProductSize(models.Model):

    product = models.ForeignKey(Product, on_delete=models.CASCADE, related_name="sizes")

    size = models.IntegerField()

    stock = models.IntegerField()

    def __str__(self):
        return f"{self.product.name} - Size {self.size}"


class ProductImage(models.Model):

    product = models.ForeignKey(Product, on_delete=models.CASCADE, related_name="images")

    image = models.ImageField(upload_to="products/")

    def __str__(self):
        return self.product.name