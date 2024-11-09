import React, { useState } from "react";

const Staff = () => {
  const initialStaff = [
    {
      id: "NV001",
      name: "Nguyen Van A",
      avatar:'data:image/jpeg;base64,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',
      username: "nguyenvan a",
      email: "a@email.com",
      dob: "1990-01-01",
      gender: "Nam",
      idNumber: "123456789",
    },
    {
      id: "NV002",
      name: "Tran Thi B",
      avatar:'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wCEAAkGBxMTEhUSEhIVFRUVEBUVEhUVFRUVFRUVFRUWFhUVFRcYHSggGBolHRUVITEhJSkrLi4uFx8zODMtNygtLisBCgoKDg0OFxAQFy0dHR0tLS0tLSstKy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tKzc3NzctLf/AABEIAOEA4QMBIgACEQEDEQH/xAAbAAACAwEBAQAAAAAAAAAAAAACAwABBAUGB//EAEIQAAEDAgMDCAUJCAIDAAAAAAEAAgMEERIhMQVBUQYTImFxgZGhFTJSkrEUFjNCU2KTwdEjVHKCwtLw8ReiVeHj/8QAGQEAAwEBAQAAAAAAAAAAAAAAAAECBAMF/8QAJhEBAQACAQMFAAEFAAAAAAAAAAECEQMEITESQVFhgSITMlJisf/aAAwDAQACEQMRAD8A90EQKSHIgVy2o8FECkByMOTlB7XJrSsrXJjXJk1tTGlZmPTGlLYaGlNaVna5MaUw0AorpTXIgVNJnqxkvnkIw7SePaYfOMH8l9Fn0Xzyv6O04j7QaPHG1FViOy8TK3C4g6hxB7Qc17qVlnEdZ+JXiK6MNleAcsZ/0uecdcBQuP1QutRsZhcZ3m9mloBLiCD7I6iR3rjxk6DJdHZj42F1wZCY3DC0XOl733EWXDJ2xdGHaBGVPCB9+TpHtDdPG6bNs17rSVU1hxkdYdjW/oEqlq539GCMRjiBif7x07gmP2fFGcdVNd+9ty+Q9ozPiuNdVMrIGZQxOmd7T+izuGp8lpbT1c46b8Ee9rOgwDrtqO0pEe1bdGlp7fflFz3MGXiSnSbImlGOqmLWffcGsHY3TyS2ZQFFBli553sxgEX63afFNG0amTo08TYRxDcT/eIsO4IWz0kWUbXTuHAYWe8fyC0iasmyjaIWndGLHvec/CyAyybAA/aVc9id8jruPUM7lQbTpo8oIHSu3Of0W9ttT4BaH7Dhi6dVO1pPtOxPd3ZuKU/b1PHlTU5kPtP6DfDU+SNbLa7VtRlcxtP1YwWDvI6R8VDsSmp86iZjTrhvdx/lGZSi+vqcsRYw/ViHNt7L6nxVfN2GDpVMzGHUgm7j2DUo/QL5ds32n/hO/RRL53Zv2j/wn/2q0dvsPTByvElNcruvRYD2lEHJLXIg9A0eCmByQHKwUBrY5NY5ZGuTWvQGtrk1rlkaU1jkytamlMDlnDkwFUlc2i+ecqujW07useUg/uK+gvcvn/L4dOFw3Od/Sf6VKsfLZWCz3fxH4rw+2/pn2Fsx5gZhe52gbyE8bHyC8ZyjjPO3t9UWPHVTmvDy58YvqcvJdXY8zWSMwNL3lwDdzbnLPxXPipSdRxXRpo3MLSxmdxYntXCzbtjXQgFVMLD9kzeGDALdZ1PeUcdNSw+s8yO9mPPPrdp5prtnSSEmWYBl95wt7baLTE+liHQY6Z3EdFnvHPyXG43w7Sqhq53dGnhbENxtjfbjci3kifsQD9pVzgE/aPu7uH6JdRtmUiwc2Fvsxix73HPwsuM6SIOxEY3cXHEfNXjw5VFzjsnbFLFlTwumduc7oM7hqfAKufr6jIHmmnLDEMIt1u9bzWWh2uxukTTwxX/LVbXSVNT0WSFrfZj6At12z8Spy47FTLbOdgQQ9KqnY1xzIviee4XJUO26ePKnpjIdz5OiO3CMz5KnbGpYc6iobi3tacT79YbcqvT0LMqalLz7UmQ91tz5hc9bVtZmr6nIOLGn6sQwD3vW80B5PQw9KpnYwnOznXee7Nx8FOd2hUZYnMafqxDmx4t6R7yibyXiiGKolZHfXG6zj3alH6CsWzPt3/hSfoom/J9m/vA/Dl/RRHb7Lu7t0V0lrleNeixHAomuWWSoDdSsr9rMG9Ade6a1cJu2mcU0bYajQdtpTcS4bdsssqft1tsgboDuiWys1YG8Ly8u0XO6lbKglVE16f0k3LNDVbaa0ZZngvOF3FAXBMnSft550sFy66Uyjp9K2iTK22YVMepqly1bjr2eCzveHEXF0U6zRuzClWnSghA0ATSEtr7BNiTgZpo7659qxVUpaMvJdZwSJIQUaPbzshOrj3JbpOoBdSqpM7i3bvtwXOnhtqU1S7IZLc2z8F6Ol2ZUStDGFwb9YA2B43XK2dCb4rXtp2rv/IKuoGF0jsHBvRHeBks/NfZ1whPoWkg+nnZcfUb03e63TvVjbsDOjTUrnn25ei33Rf8AJH6Jo6f6edgd7ION3utuUDuUdOzKmpXvPtSWa3tAFyfJZfLpvSjPtCfIO5tp+rE0MHj63mjZyTDP2lRK1gOZdI4AnvcblL+X7RnyaRE07om4Tb+LN3mij5Hu+kqJAOL5X/1OKPAF8j2d++R+Lv0UQehqH98p/wAVv6qI7fJfrpgqOKXdWvRY3ndsyuBPkuQ151xDzK9XtKkDxmvL1VG9h6tx18k4Ysd+B8QgbKRvPxSWjtPktVNCT2JhcLX3uDcf5qF04Y7ZnvVRNtuTEaTtoaEeJZXvKBrymVbzLcLMJSCoHpE7kCR0GPSXZHJJhlyROmyUK0NzrrLHqr5zJKx5pOk8Omx3RWiF2SwMky1T2S5JwrD5XKxosj5s1nn2vG3IuF1US3uIKyT0YOeiKm2i128LWHA6Io7s8VS5gwxQtLrWDnXJHWNE/wBFVlQLSSODd4Bwt7wMimsqXszjDb8SL27Fjk2ZWVR6cr3N4XIZ4DJYuXGytGFmhnZFFT/TTsuNWtu93usvZA/lLSx5QUzn8HSEMHgLn4IPQVJB9PUsB3sacTvdbcqemqOPKCnklO5z7Rt/M+S5dr9r/QO29Xy5R2iad0TMP/Y3PhZDFySqJjjmc47y6RxNv5nFN9NVsmUMccIOmBl3e8+/wVt5NVVRnM+R/wDG5xA7Acgjx9DSfNKL94i/Ej/VRM+Yw9pvvBRG/sabrqw5LBRLexpJouRWU5Oq6xS5WhOB5Sspywh1jb4LVSPvote0IyfFXSQBqqCmNYreQpJKsk0qNloUkoC5tZtZrdSsW0q0jLNeYqJC4YnHXQdSIb0Y5TtB081up9tRyCwNjwOS8LFBjJsQCGl2ZtoL2HX1JTLjfvT0H02OXJXLOvLbA2sfUec7dE8e1ejmtZKw4uGe5RPdmFmaLao3SqFtEktrLVA+4usrHhwsUG0i4U8mE54SnPIvhwuUPKE3LIjpkXD8l5kVRJ6RPitNTT2GSRXAkMN2+oAA3I2Fz0uJz1XTSNu3sypLSMyQvY0VVkvnuzZLMJPEAeK91QR5A9SWRy7dlkx4IqqnMrQ3nHhvshxDT2hKiK0scudmzl0zDYNLDnNPGz7oOJ3utuVZ21RR5Q08kx3FwEbfO7vJaG7NpjeSV7IxfO+p7BvS37Y2fDkyOSY9TAxvi7PyWPLHvry0S7J+cVW/KCGOEbi1pe7xdl5KvQtbUfSyyvB3Fxw+6MvJE7lXUOyp6WOMbnEOkd+Q8kl8G0qjJ80lifVaebb4MA81Hj6P8O/49d7PkrWb5lVHF/vOUR+jX06KK6WHKwVvYzboJHWCgKz1L04CJDcoC+wQ4kt5Vp9wWuVUkaa1CTdTVODtWjJaSOBXmZmXjbbcLEL30kfBc2o2U1xvaxOpGXiE8b7CvFRkAgkXzzHFWBidkLDd1L00fJQSPDWvIvm42uGt4/kAnz8mWQyYS4vGAOGQG8izvBdZxZen167OV5sfX6Pd5eOE4wQNLZr2VPMcIvw0STSgDIWT44clytdZC5Xkp8bRZKqiGhc5+0tynW3XHG134rICL3adCPiuC2tPHJbtmbR6VnHL4J60u8dkZ6nYTsNmkHgDl5rlU3JmolkwBoHtOJGFvbb4L3UvqXB1sL8ASBfuvfuXRlHNNayMAXyDneq08XbySey53rZ0vDOSXLO9o83q+ovHZhhO+Tx+zeTPNutJ0nNINh6mejhvO/XgvRw05WuOkIu5xxOJ6RItpoANwWhsSy8llyvp8NXHMpjPV5IjYnNCPAo1qhSNiDui/wBW+aGar2dB9V8rhuYyw8XEIghmdQRC8pcXkXLGsc4+OnmuHNj7unHl7EP5YEZU9EwcDIS4+60D4pXpTac2jzGDuiYGedsXmidywgZlT0TncDI4NHbZt/is7+VO0JMomRwg6c3EHHxkxDyWfV+NOvn7H6N2j+8T/iyfqok/Ltq/by+7F/aol3+j1/q33UDkoFECtzGbdYqp2a04liqtVeJALskAfxVngiEasgteEwlAWq8PBRVDDbq3MyVAFE0cUgfsZvQktbHjde+7LoX6rWPisBpy137S+NxzcTcOPUfgMuxaTBniBIduc02PYeI6imySF1K5z7E4XYTa1yHERuA4mzT3r1cPT1HF6PFxn48rOZ9Ny+vzMr+ue+AXU5pPeMrgXuUwxZLy7Hqxw9pbOL7kOIy0Xl9q7ElGeLRfQsASpWNt0rWTldZXz1r3h2twR4L0fJ/Y4NnG5ub5rLPQNEoA0Nz5r1uy7WAH+ZJ10yy7N0VMLYbC1rEbrIgx7BYjHHbte0feH1x169qfGbbimT1IaxztSBkPvHJvmQunT8ufHl/H3Y+o4cOTH+XszMfhAc04ozbfewOhaeHV/pbS1Ym02TIQdfWP3WkF57yQP5l05GW1WjrsMcc5qauu7L0GeeWF9V3N9mR4QEKVI4EKMYVhb6Y1qW+mpvXqDbsaXE+ATWgoXU7H5SZN1Jz/ACU547h4XVYzygoIvo6aSQ7i4NYPHM+SQ7llOcoKWCPrcHyH+keSdLtLZ0WkUsp6mho8XOHwSjyza3KChaOBe6/k0D4rDr6af0Pzj2lwi/BCir56Vf2FP+G/+9RHf4g0IFFiSwVa3aYx3WeoTkqdVCvhm3rQAl2RsKpMLkahMtk7m0Dou5JYBKSdLLQz/Mlhe0jetME17AZlAPmuW2F8yG30sXEDLxWmpc0OZHua3FbjbosHZqe4JEkbiBYgEODmjrBuL8BlZPIbM3HYse24vvaRqLjJzf8ANV6PS4+rjzxx8vM6vL08uGWX9s/6FkriSAzLilPhcRmbZoIqtz2gtFrgX7SM7cU17DkblefXpbC5zRlvXOrJLptW/h3lcqqlJyGaNLjHPUWkHDS+5dvZ0tyPJcr5FdtkVLijNnXtxT0t7SmmyAPim1oxRlrR0rtc2+hLXBwB7bWXJo572IN8l16aUEZp49rLHLKbllZsYdzcrSRmG9eF5DSD1g2P8q6rmkZarjQZsaB9aY2/Ec4/A+C62Y3rZ11lyxvzGHoJZjlPaWklmeYTWgJjWlE63+lhbyi0JLs0x6RJlmgmapkoIs5pCXb2tYXHxtbzWB/K+gj+ipJXkaF3NsHkXHyWLaUFO5xdJUxN6gS8+DQVznT7OZrLLJ/BGQP++FYcsZtqm/nTs/8AIEX/AI8fj/8AzUXD9K7P+yqPCP8AvUU/058U+/8Ak9A0o8SUEV1tZBYkMipWnCpYKNqW5pRMJ4KkmYggJPBNjb1Jp6kLjI5nG/YEoTBug7gPitjo7rLPFwQKY+odhIb61tBr/tOfM1zRHHcMA6RsRceyL6k7ysDWFnafJEZ7dq68fPlx42T3cOTgnJlLl7NoltkAlSTYWm5WRk5RYS/VcnZifd5yyC0xUfUtsMIGVlqjjTVtz46XNaH0QI0WtseacGpbPbh08JjfbduXZppAhngBQMpToi0j2wMDsbQA658TrloFphkJSY6e2a0BLdpakag9Di/zelNkQSOG5M1ySd/xWOV4eCMxcEXVzSE5Wv1qRtt1/FAeF2pst4c7IOtvHRd4HXzXGkpT/vI+IyX1CvoGTN6Q7DvC8PtnZUkRJcLtvk4Ag27dPFRYcri/In+wfNRO54+27w/9qKT29yCrul4lWJUjZl0QS2i61BlgqhVnD05tlle6xyRMlunpLTiRNKWy29EJEqqDJKmXfuVgIXFJRb4xqkmnT8yo47hqnsmZsSNxtuWlgARFgITBEEt81rbIFjkpuCq1hqgabxIERlvk1cpsl73OhT46ggiwJ7ktm6MYN81qu0blz2TPO5MDHHUpWhqEl0QKTHDZOEaACQlLDVq5tUY04QAlOZbROLUolMCDkEzARZwBHWFYKIpU4xejYvYb7rVFp5tqpSbgq2hLxImG5yQ5ttPHbNG/NWwWFlCukKsk0N0ksI0W8hDzaAyRyJ0cg3ouaVPgupWYH33oXOskupzxKnMHeUtBfPX0U57PLVA2mAPxT2MA0TLZJlduYVYxngE9EwI0JS2xvOrvBMjoR1nvTmBaGIGwRUjRuWhsKtqYwJmtsaYyNQBGEAOBVdMQAIAlRVFBdAVIs7ynPKRIUADZOpPtdZcSdG9IGcz1qK+cUS0rTy4WqlZmsgW2ndkn7oanIQo1yslMrECsKgiQNIQqVlRJSiELkZQPRAWVLqnIQE4mjCdGxCAmsKNFDGNTmhKBTAUKMaE5pSAUxjkjOurBS7qIBql0pRMCLkslWhcgAeVmlWhxSJAgwBEAgCu6RGXUQYlEaDgArRTkrOFtpWWzRCOY1HZW0KyEwpWCpZC5AgiVMSUXKi9IzS9A56ElBdARzlYKGyl7JorQ1yMFZ2lXzqA2NKPEsrXJgei1UaGuTA5ZWPTA9TDaA9GHJDXI8SoGhymJKKJAHiQFyolKc9AMJQHNLxqi9AA5BiVuKXiSMd1EN1SXcOfSC2ZtnotjSlxsCcAnE1GlEXoEbWplEbmqcUwMU+TEoUzOKTiXTFGN6v5E1SHLxK2BddtK3gjEA4BAcgMKIRnguwIQiwDgqLTjCB3BEYnDcuyGqw0ILTi3KJq7RjHAJb6ZpQcc0FE0rRJRcCkGBwUmMPRgrPdWHpl3agVeJZecRCVBnlyTIUHOoHvTC3OQYkLnJd0tmY8pZerxIHpbC8aiSrRsjWI1FE4moExiiiKZzFojUUTMTlFFEqBBWFFEoBhUVFFRLaiaoog6IqKKIKeAlLeoopnk2GVKcoonQEKyoolBFBAVaiZlvQv1CiikLCjlFEACiiiA/9k=',
      username: "tranthi b",
      email: "b@email.com",
      dob: "1992-05-12",
      gender: "Nu",
      idNumber: "987654321",
    },
  ];
  const [staff, setStaff] = useState(initialStaff);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStaff, setSelectedStaff] = useState(null);
  const [formData, setFormData] = useState({
    id: "",
    name: "",
    avatar:"",
    username: "",
    email: "",
    dob: "",
    gender: "",
    avatar:"",
    idNumber: "",
  });
  const [isAdding, setIsAdding] = useState(false);
  const filteredStaff = staff.filter((staff) =>
    staff.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAdd = () => {
    setFormData({
      id: "",
      name: "",
      avatar:"",
      username: "",
      email: "",
      dob: "",
      gender: "",
      idNumber: "",
    });
    setIsAdding(true); 
    setSelectedStaff(null); 
  };

  const handleSearch = (event) => {
    setSearchTerm(event.target.value); 
  };

  const handleSave = () => {
    if (selectedStaff) {
     
      setStaff(
        staff.map((emp) =>
          emp.id === selectedStaff.id ? formData : emp
        )
      );
      setSelectedStaff(null);
    } else {
      
      setStaff([...staff, formData]);
    }
    setIsAdding(false); 
    setFormData({
      id: "",
      name: "",
      avatar:"",
      username: "",
      email: "",
      dob: "",
      gender: "",
      idNumber: "",
    });
  };
  
  const handleCancel = () => {
    setIsAdding(false);
    setFormData({ id:'', name: '',avatar:'', username: '', email: '', dob: '', gender:  '', idNumber: '' });
    setSelectedStaff(null);
  };

  const handleDelete = (id) => {
    const confirmDelete = window.confirm('Bạn có chắc chắn muốn xóa nhân viên này?');
    if (confirmDelete) {
      setStaff(staff.filter((emp)=> emp.id  !== id));
    }
  };
  return (
    <div>
      <h1 style={{ color: '#ff8c00', fontSize: '30px' }}>Quản Lý nhân viên</h1>
      {!isAdding ? (
        <>
      <div>
     
        <input
          type="text"
          placeholder="Tìm Kiếm"
          value={searchTerm}
          onChange={handleSearch}
          style={{
            padding: "8px",
            width: "70%",
            marginBottom: "10px",
            borderRadius: "4px",
            border: "1px solid #ddd",
          }}
        />
        <button
          className="btn-add-staff"
          onClick={handleAdd}
          style={{
            width:'200px',
            padding: "8px 12px",
            marginLeft: "10px",
            backgroundColor: '#ff8c00',
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
            
          }}
       
        >
          Thêm Nhân Viên Mới
        </button>

       <div style={{ display: 'flex', flexWrap: 'wrap', gap: '20px', marginTop: '20px',marginLeft:'5px' }}>
        {filteredStaff.map((item) => (
          <div  style={{
            width: '300px', 
            border: '1px solid #ddd', 
            borderRadius: '8px', 
            padding: '20px', 
            boxShadow: '0px 4px 8px rgba(0,0,0,0.1)', 
            textAlign: 'center', 
            backgroundColor: '#ffffff',
            marginRight:'20px',
          }}>
         
            <img 
              src={item.avatar} 
              alt={`${item.name}'s Avatar`} 
              style={{ width: '150px', height: '150px', borderRadius: '50%', marginBottom: '15px' }}
            />
            <h3 style={{ fontSize: '18px', margin: '10px 0 10px' }}>{item.name}</h3>
            <p style={{ fontSize: '14px', color: '#666', margin: '8px 0' }}>Mã NV: {item.id}</p>
            <p style={{ fontSize: '14px', color: '#666', margin: '8px 0' }}>UserName: {item.username}</p>
            <p style={{ fontSize: '14px', color: '#666', margin: '8px 0' }}>Email: {item.email}</p>
            <p style={{ fontSize: '14px', color: '#666', margin: '8px 0' }}>DoB: {item.dob}</p>
            <p style={{ fontSize: '14px', color: '#666', margin: '8px 0' }}>Giới tính: {item.gender}</p>
            <p style={{ fontSize: '14px', color: '#666', margin: '8px 0' }}>CMND: {item.idNumber}</p>
            <button 
             
              style={{ 
                padding: '5px 15px', 
                marginRight: '10px', 
                backgroundColor: '#ff8c00', 
                color: 'white', 
                border: 'none', 
                borderRadius: '4px', 
                cursor: 'pointer' 
              }}
            >
              Chỉnh sửa
            </button>
            <button 
              onClick={() => handleDelete(item.id)} 
              style={{ 
                padding: '5px 15px', 
                backgroundColor: '#f44336', 
                color: 'white', 
                border: 'none', 
                borderRadius: '4px', 
                cursor: 'pointer' 
              }}
            >
              Xóa
            </button>
          </div>
        ))}
      </div>
      </div>
     
      </>
      ) : (

      <div
        style={{
          marginTop: "20px",
          padding: "20px",
          border: "1px solid #ddd",
          borderRadius: "15px",
          backgroundColor: "#dcdcdc",
          width: "970px",
        }}
      >
        <h3 style={{ marginBottom: "20px" ,color:'#ff8c00'}}>
          {selectedStaff ? "Chỉnh sửa Nhân Viên" : "Thêm Nhân Viên Mới"}
        </h3>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSave();
          }}
        >
          <input
            style={{
              padding: "8px",
              width: "900px",
              marginBottom: "25px",
              borderRadius: "5px",
              border: "1px solid #ddd",
            }}
            type="text"
            placeholder="Mã"
            value={formData.id}
            onChange={(e) => setFormData({ ...formData, id: e.target.value })}
            required
          />
          <input
            style={{
              padding: "8px",
              width: "900px",
              marginBottom: "25px",
              borderRadius: "5px",
              border: "1px solid #ddd",
            }}
            type="text"
            placeholder="Họ và tên"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
          />
           <input
            style={{
              padding: "8px",
              width: "900px",
              marginBottom: "25px",
              borderRadius: "5px",
              border: "1px solid #ddd",
            }}
            type="text"
            placeholder="Ảnh đại diện"
            value={formData.avatar}
            onChange={(e) => setFormData({ ...formData, avatar: e.target.value })}
            required
          />
          <input
            style={{
              padding: "8px",
              width: "900px",
              marginBottom: "25px",
              borderRadius: "5px",
              border: "1px solid #ddd",
            }}
            type="text"
            placeholder="Tên tài khoản"
            value={formData.username}
            onChange={(e) =>
              setFormData({ ...formData, username: e.target.value })
            }
            required
          />
          <input
            style={{
              padding: "8px",
              width: "900px",
              marginBottom: "25px",
              borderRadius: "5px",
              border: "1px solid #ddd",
            }}
            type="email"
            placeholder="Email"
            value={formData.email}
            onChange={(e) =>
              setFormData({ ...formData, email: e.target.value })
            }
            required
          />
          <input
            style={{
              padding: "8px",
              width: "900px",
              marginBottom: "25px",
              borderRadius: "5px",
              border: "1px solid #ddd",
            }}
            type="date"
            placeholder="Ngày sinh"
            value={formData.dob}
            onChange={(e) => setFormData({ ...formData, dob: e.target.value })}
            required
          />
          <select
            style={{
              padding: "8px",
              width: "900px",
              marginBottom: "25px",
              borderRadius: "5px",
              border: "1px solid #ddd",
            }}
            value={formData.gender}
            onChange={(e) =>
              setFormData({ ...formData, gender: e.target.value })
            }
            required
          >
            <option value="">Giới tính</option>
            <option value="Nam">Nam</option>
            <option value="Nu">Nữ</option>
          </select>
          <input
            style={{
              padding: "8px",
              width: "900px",
              marginBottom: "25px",
              borderRadius: "5px",
              border: "1px solid #ddd",
            }}
            type="text"
            placeholder="Số CMND"
            value={formData.idNumber}
            onChange={(e) =>
              setFormData({ ...formData, idNumber: e.target.value })
            }
            required
          />
          <button
            type="submit"
            style={{
              border: "none",
              padding: "8px",
              backgroundColor:'#ff8c00',
              color: "white",
              borderRadius: "10px",
              width: "200px",
              marginLeft: "150px",
            }}
          >
            {selectedStaff ? "Lưu" : "Thêm"}
          </button>
          <button onClick={handleCancel}
           type="submit"
           style={{
             border: "none",
             padding: "8px",
             backgroundColor:'#ff8c00',
             color: "white",
             borderRadius: "10px",
             width: "200px",
             marginLeft: "200px",}}>Hủy</button>
        </form>
      </div>
       )}
    </div>
  );

};

export default Staff;
