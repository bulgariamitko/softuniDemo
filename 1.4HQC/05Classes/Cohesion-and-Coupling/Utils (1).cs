﻿using System;

namespace CohesionAndCoupling
{
    class Utils
    {
        private double width;
        private double height;
        private double depth;

        public double Width { get; set; }
        public double Height { get; set; }
        public double Depth { get; set; }

        public static double CalcDistance2D(double x1, double y1, double x2, double y2)
        {
            double distance = Math.Sqrt((x2 - x1) * (x2 - x1) + (y2 - y1) * (y2 - y1));
            return distance;
        }

        public static double CalcDistance3D(double x1, double y1, double z1, double x2, double y2, double z2)
        {
            double distance = Math.Sqrt((x2 - x1) * (x2 - x1) + (y2 - y1) * (y2 - y1) + (z2 - z1) * (z2 - z1));
            return distance;
        }

        public static double CalcVolume(double width, double height, double depth)
        {
            double volume = width * height * depth;
            return volume;
        }

        public static double CalcDiagonalXYZ()
        {
            double distance = CalcDistance3D(0, 0, 0, Width, Height, Depth);
            return distance;
        }

        public static double CalcDiagonalXY()
        {
            double distance = CalcDistance2D(0, 0, Width, Height);
            return distance;
        }

        public static double CalcDiagonalXZ()
        {
            double distance = CalcDistance2D(0, 0, Width, Depth);
            return distance;
        }

        public static double CalcDiagonalYZ()
        {
            double distance = CalcDistance2D(0, 0, Height, Depth);
            return distance;
        }
    }
}
