<?php

namespace AppBundle\Controller;

use AppBundle\Entity\Cart;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Method;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Security;
use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Annotation\Route;

class CartController extends Controller
{
    /**
     * @Route("/cart/show/{id_user}", name="cart_show")
     * @Security("is_authenticated()")
     * @Method("GET")
     * @param $id_user
     * @return \Symfony\Component\HttpFoundation\Response
     */
    public function indexAction($id_user)
    {
        // find cart
        $em = $this->getDoctrine()->getManager();
        $cartEm = $em->getRepository('AppBundle:Cart');
        $cart = $cartEm->findBy(
            array('userid' => $id_user)
        );
        return $this->render('cart/index.html.twig', array(
            'cart' => $cart,
        ));
    }

    /**
     * @Route("/cart/add/{id_user}", name="cart_add")
     * @Security("is_authenticated()")
     * @Method("POST")
     * @param Request $request
     * @param $id_user
     * @return \Symfony\Component\HttpFoundation\Response
     */
    public function addToCart(Request $request, $id_user)
    {
        $em = $this->getDoctrine()->getManager();

        // get the data from the form
        $qtty = $request->request->get('qtty');
        $productId = $request->query->get('id_product');
        $promotionId = $request->query->get('id_promotion');

        // find if the qtty of the product is more of the qtty available
        $product = $em->getRepository('AppBundle:Products')->find($productId);

        if ($qtty > $product->getQtty()) {
            $this->addFlash('notice','This product dont have such amount of quantity and you cant add it. Please try to add less quantity!');

            return $this->redirectToRoute("cart_show", array('id_user' => $id_user));
        }

        // find if there is already a product for this user in the cart
        $cartEm = $em->getRepository('AppBundle:Cart');
        $cart = $cartEm->findBy(
            array('userid' => $id_user, 'productid' => $productId)
        );
        if (!empty($cart)) {
            $this->addFlash('notice','This product is already added in the cart. If you want to change the quantity of it, please first delete it from the cart and then add it again!');

            return $this->redirectToRoute("cart_show", array('id_user' => $id_user));
        } else {
            // try to add to DB
            try {
                // set Cart
                $cart = new Cart();
                $cart->setProductid($productId);
                $cart->setUserid($id_user);
                $cart->setDate(new \DateTime());
                $cart->setQtty($qtty);
                $cart->setPromotionid($promotionId);

                // add to DB
                $em->persist($cart);
                $em->flush();

                $this->addFlash('notice','A new Product have been added to the database!');
            } catch (Exception $e) {
                $this->addFlash('notice','Failed to add a new product to cart. Check errors log!');
                throw new Exception($e->getMessage() . "<br>" . $e->getTraceAsString());
            }
            return $this->redirectToRoute("cart_show", array('id_user' => $id_user));
        }
    }

    /**
     * @Route("/cart/order/{id_user}", name="cart_order")
     * @Security("is_authenticated()")
     * @Method("POST")
     * @param Request $request
     * @param $id_user
     * @return \Symfony\Component\HttpFoundation\Response
     */
    public function cartOrder(Request $request, $id_user)
    {
        $total = $request->query->get('total');
        $em = $this->getDoctrine()->getManager();
        // find cart
        $cartEm = $em->getRepository('AppBundle:Cart');
        $cart = $cartEm->findBy(
            array('userid' => $id_user)
        );
        // find user
        $user = $em->getRepository('AppBundle:User')->find($id_user);
        if ($user->getWallet() - $total >= 0) {
            // minus the total order money from the user wallet
            $user->setWallet($user->getWallet() - $total);
            // loop over all products in the order
            foreach ($cart as $ca) {
                // find prodcut
                $product = $em->getRepository('AppBundle:Products')->find($ca->getProductid());
                $product->setQtty($product->getQtty() - $ca->getQtty());
                // delete products in order
                $em->remove($ca);
                // execute
            }
            $em->flush();
            $this->addFlash('notice','The order have been completed! Don\'t expect anything send as this is just a demo project for my exam in SoftUni!');

            return $this->redirectToRoute("cart_show", array(
                'id_user' => $user->getId(),
            ));
        } else {
            $this->addFlash('notice','Sorry, but you dont have enough money. Please reconsider what u want to buy or ask your bank for money!');

            return $this->redirectToRoute("cart_show", array(
                'id_user' => $user->getId(),
            ));
        }
    }

    /**
     * @Route("/cart/delete/{id_order}", name="cart_delete")
     *@Security("is_authenticated()")
     * @Method("GET")
     * @param $id_order
     * @return \Symfony\Component\HttpFoundation\Response
     */
    public function cartDelete($id_order)
    {
        // find cart
        $em = $this->getDoctrine()->getManager();
        $cartRecord = $em->getRepository('AppBundle:Cart')->find($id_order);
        $em->remove($cartRecord);
        $em->flush();
        $this->addFlash('notice',"The record have been deleted from the cart.");

        return $this->redirectToRoute("cart_show", array(
            'id_user' => $cartRecord->getUserid(),
        ));
    }
}
