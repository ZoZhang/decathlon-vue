<?php

/**
 * Nuit de info pour défi decathlon
 *
 * @author ZHANG Zhao
 * @email  zo.zhang@gmail.com
 * @site   decathlon.zhaozhang.fr
 */

namespace App\Controller;

use Symfony\Component\Routing\Annotation\Route;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;

class IndexController extends AbstractController
{
    /**
      * @Route("/")
    */
    public function index()
    {
        return $this->render('frontend/index/home.html.twig');
    }
}
