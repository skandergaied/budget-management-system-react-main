package com.example.LoginRegister.services;

import java.security.Key;
import java.sql.Date;
import java.util.HashMap;
import java.util.Map;
import java.util.function.Function;

import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;

@Service
public class JwtService {
    private static final String SECRET_key = "NkU0NzYzRjg3MDRCMkM3NDNGM0YyOEU3QTkwMzVGQzg5MjMzQTY0RjMyNDVBOTNGMkM0RkIzRDU2OUEyNzU1Qg==";
    public String extractEmail(String jwt) {
        return null;
    }

    public String extractUsername(String jwt) {

        return extractClaim(jwt, Claims::getSubject);
    }
    
    public String generateToken(UserDetails userDetails) {
    return generatTokeaString(new HashMap<>(), userDetails);
  }

  public  String extractUserId(String token) {
    Claims claims = extractAllClaims(token);
    System.out.println("Claimsggggggggggggggggggggggggggggggggggggggggggggggggggggggggg: "+claims ); 
    return claims.get("userId", String.class); 
}

  

    public String generatTokeaString(Map<String, Object> extractClaims, UserDetails subject) {
        System.out.println("dhdhdhdhhdhdhdhdhdhdhdhdhd"+subject);
        return Jwts.builder().setClaims(extractClaims).setSubject(subject.getUsername()).setIssuedAt(new Date(System.currentTimeMillis()))
        .setExpiration(new Date(System.currentTimeMillis()+10000*60*24)).signWith(getSignInkey(),SignatureAlgorithm.HS256).compact()
        ;
    }

    public Boolean validateToken(String token, UserDetails userDetails) {
        
        final String username = extractUsername(token);
        return (username.equals(userDetails.getUsername()) && !isTokenExpired(token));
        }


        
        private boolean isTokenExpired(String token) {
                
                return extractexpiration(token).before(new Date(0));
                    }
                
                
                
                        
         private java.util.Date extractexpiration(String token) {
          return extractClaim(token, Claims::getExpiration);                  
          
        }
                
        public <T> T extractClaim(String token, Function<Claims, T> claimsResolver) {
        final Claims claims = extractAllClaims(token);
        return claimsResolver.apply(claims);
      }
    private  Claims extractAllClaims(String jwt) {
        return Jwts.parserBuilder().setSigningKey(getSignInkey()).build().parseClaimsJws(jwt).getBody();
        
            }
            private Key getSignInkey() {
                byte[] keyBytes = Decoders.BASE64.decode(SECRET_key);
                
                return Keys.hmacShaKeyFor(keyBytes) ;

            }
    
}
