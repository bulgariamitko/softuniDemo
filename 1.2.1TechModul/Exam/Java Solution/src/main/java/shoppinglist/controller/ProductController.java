package shoppinglist.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import shoppinglist.bindingModel.ProductBindingModel;
import shoppinglist.entity.Product;
import shoppinglist.repository.ProductRepository;
import java.util.List;
import java.util.stream.Collectors;

@Controller
public class ProductController {

	private final ProductRepository productRepository;

	@Autowired
	public ProductController(ProductRepository productRepository) {
		this.productRepository = productRepository;
	}

	@GetMapping("/")
	public String index(Model model) {
		List<Product> products = productRepository.findAll();
		model.addAttribute("products", products);
		model.addAttribute("view", "product/index");
		return "base-layout";
	}

	@GetMapping("/create")
	public String create(Model model) {
		model.addAttribute("view", "product/create");
		return "base-layout";
	}

	@PostMapping("/create")
	public String createProcess(Model model, ProductBindingModel productBindingModel) {
		if (productBindingModel == null) {
            return "redirect:/";
        }

		if (productBindingModel.getPriority().equals("") || 
			productBindingModel.getName().equals("") || 
			productBindingModel.getQuantity().equals("") || 
			productBindingModel.getStatus().equals("")) {
			
			model.addAttribute("product", productBindingModel);
			model.addAttribute("view", "product/create");
			return "base-layout";
		}

        Product product = new Product(
        	productBindingModel.getPriority(), 
			productBindingModel.getName(), 
			productBindingModel.getQuantity(), 
			productBindingModel.getStatus());
        productRepository.saveAndFlush(product);

        return "redirect:/";
	}

	@GetMapping("/edit/{id}")
	public String edit(Model model, @PathVariable int id) {
		Product product = productRepository.findOne(id);

        if (product == null) {
            return "redirect:/";
        }

        model.addAttribute("product", product);
        model.addAttribute("view", "product/edit");

        return "base-layout";
	}

	@PostMapping("/edit/{id}")
	public String editProcess(Model model, @PathVariable int id, ProductBindingModel productBindingModel) {
		Product product = productRepository.findOne(id);

		if (productBindingModel == null) {
            return "redirect:/";
        }

		if (productBindingModel.getPriority().equals("") || 
			productBindingModel.getName().equals("") || 
			productBindingModel.getQuantity().equals("") || 
			productBindingModel.getStatus().equals("")) {

			model.addAttribute("product", productBindingModel);
			model.addAttribute("view", "product/create");
			return "base-layout";
		}

		if (product != null) {
			product.setPriority(productBindingModel.getPriority()); 
			product.setName(productBindingModel.getName()); 
			product.setQuantity(productBindingModel.getQuantity()); 
			product.setStatus(productBindingModel.getStatus()); 
			productRepository.saveAndFlush(product);
		}

		return "redirect:/";
	}
}
