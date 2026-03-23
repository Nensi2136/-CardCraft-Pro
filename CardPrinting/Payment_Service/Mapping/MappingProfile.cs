using AutoMapper;
using Payment_Service.Models;
using Payment_Service.Models.DTOs;

namespace Payment_Service.Mapping
{
    public class MappingProfile : Profile
    {
        public MappingProfile()
        {
            // Payment mappings
            CreateMap<Payment, PaymentDto>();
            CreateMap<CreatePaymentDto, Payment>();
            CreateMap<UpdatePaymentStatusDto, Payment>()
                .ForAllMembers(opts => opts.Condition((src, dest, srcMember) => srcMember != null));

            // PaymentMethod mappings
            CreateMap<PaymentMethod, PaymentMethodDto>();
            CreateMap<CreatePaymentMethodDto, PaymentMethod>();
            CreateMap<UpdatePaymentMethodDto, PaymentMethod>()
                .ForAllMembers(opts => opts.Condition((src, dest, srcMember) => srcMember != null));
        }
    }
}
