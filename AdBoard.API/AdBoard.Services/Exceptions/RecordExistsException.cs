using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace AdBoard.Services.Exceptions
{
    public class RecordExistsException : Exception
    {
        public RecordExistsException(string message) : base(message) { }
        
    }
}
