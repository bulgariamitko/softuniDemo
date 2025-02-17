<?php

namespace AppBundle\Repository;

/**
 * RoomRepository
 *
 * This class was generated by the Doctrine ORM. Add your own custom
 * repository methods below.
 */
class RoomRepository extends \Doctrine\ORM\EntityRepository
{
    /**
     * @param $date_start
     * @param $date_final
     * @return array|null
     */
    public function getAvailableRooms($date_start, $date_final)
    {
        $em = $this->getEntityManager();

        $qb = $em->createQueryBuilder();

        $nots = $em->createQuery("
    	SELECT IDENTITY(b.room) FROM AppBundle:Reservation b
        	WHERE NOT (b.dateOut   < '$date_start'
           	OR
           	b.dateIn > '$date_final')
    	");

        $dql_query = $nots->getDQL();
        $qb->resetDQLParts();


        $query = $qb->select('r')
            ->from('AppBundle:Room', 'r')
            ->where($qb->expr()->notIn('r.id', $dql_query ))
            ->getQuery()
            ->getResult();

        try {

            return $query;
        } catch (\Doctrine\ORM\NoResultException $e) {
            return null;
        }
    }
}
