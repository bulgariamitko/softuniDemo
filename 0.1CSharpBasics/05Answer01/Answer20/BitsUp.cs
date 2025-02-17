﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Answer20
{
    class BitsUp
    {
        static void Main(string[] args)
        {
            int n = int.Parse(Console.ReadLine());
            int step = int.Parse(Console.ReadLine());
            int[] numbers = new int[n];

            for (int i = 0; i < n; i++)
            {
                numbers[i] = int.Parse(Console.ReadLine());
            }

            for (int currentStep = 1; currentStep < n * 8; currentStep += step)
            {
                int numberIndex = (int)Math.Floor(currentStep / 8M);
                int bitIndex = 7 - (currentStep % 8);
                numbers[numberIndex] |= (1 << bitIndex);
            }

            foreach (int number in numbers)
            {
                Console.WriteLine(number);
            }
        }
    }
}
