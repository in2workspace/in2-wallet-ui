import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  inject,
} from '@angular/core';
import { QRCodeModule } from 'angularx-qrcode';
import { WalletService } from 'src/app/services/wallet.service';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import {
  CredentialStatus,
  VerifiableCredential,
} from 'src/app/interfaces/verifiable-credential';
import { IonicModule } from '@ionic/angular';
import { CredentialTypeMap } from 'src/app/interfaces/credential-type-map';
import { CredentialDetailMap, EvaluatedSection } from 'src/app/interfaces/credential-detail-map';
import * as dayjs from 'dayjs';
import { ToastServiceHandler } from 'src/app/services/toast.service';


@Component({
  selector: 'app-vc-view',
  templateUrl: './vc-view.component.html',
  styleUrls: ['./vc-view.component.scss'],
  standalone: true,
  imports: [IonicModule, QRCodeModule, TranslateModule, CommonModule],
})
export class VcViewComponent implements OnInit {
  @Input() public credential!: VerifiableCredential;
  public credentialInput: VerifiableCredential = 
  {
    "@context": [
      "https://www.w3.org/ns/credentials/v2",
      "https://www.dome-marketplace.eu/.well-know/credentials/learcredentialmachine/v2"
    ],
    "id": "urn:uuid:68422e47-5d69-4e0b-8a49-34990f2f76a2",
    "type": ["VerifiableCredential", "LEARCredentialMachine"],
    "name": "Agent Machine Credential",
    "description": "Machine credential acting as an authorized agent on behalf of a legal entity",
    "issuer": {
      "id": "did:elsi:VATES-A12345678",
      "organization": "TRUST SERVICES, S.L.",
      "country": "ES",
      "commonName": "TRUST SERVICE ELECTRONIC SEAL FOR VERIFIABLE CREDENTIALS",
      "serialNumber": "610dde5a0000000003"
    },
    "validFrom": "2025-04-17T14:30:00.000000000Z",
    "validUntil": "2026-04-17T14:30:00.000000000Z",
    "credentialSubject": {
      "mandate": {
        "id": "urn:uuid:a2ece539-e199-4be9-a781-3a11f4a25ad9",
        "mandator": {
          "id": "did:elsi:VATFR-B12345678",
          "organization": "GOOD AIR, S.L.",
          "country": "FR",
          "commonName": "JEAN MARTIN - CNI 880692310285",
          "serialNumber": "880692310285"
        },
        "mandatee": {
          "id": "did:key:zDnaexS1hEocz1R51ZXakcUPXWZSzkVEBJAEz9fHtxjfqZRhN",
          "domain": "dpas.goodair.fr",
          "ipAddress": "195.70.63.244"
        },
        "power": [
          {
            "id": "eb02efa8-193d-43a2-8ddd-3a124c6aee83",
            "type": "domain",
            "domain": "DOME",
            "function": "Onboarding",
            "action": ["execute"]
          }
        ],
      }
      
    },
    credentialEncoded : "eyJhbGciOiJSUzI1NiIsImtpZCI6Ik1JSFFNSUczcElHME1JR3hNU0l3SUFZRFZRUUREQmxFU1VkSlZFVk1JRlJUSUVGRVZrRk9RMFZFSUVOQklFY3lNUkl3RUFZRFZRUUZFd2xDTkRjME5EYzFOakF4S3pBcEJnTlZCQXNNSWtSSlIwbFVSVXdnVkZNZ1EwVlNWRWxHU1VOQlZFbFBUaUJCVlZSSVQxSkpWRmt4S0RBbUJnTlZCQW9NSDBSSlIwbFVSVXdnVDA0Z1ZGSlZVMVJGUkNCVFJWSldTVU5GVXlCVFRGVXhFekFSQmdOVkJBY01DbFpoYkd4aFpHOXNhV1F4Q3pBSkJnTlZCQVlUQWtWVEFoUWdhQUtFL3owd3paUzM5Y2J5SWZ1TGdrdHFHdz09IiwieDV0I1MyNTYiOiJIb0pEWGJzb2xaOTIwSWZHZWxqaEVFekxxOHZBTVBHTUZ4T2VRWUlIVEZnIiwieDVjIjpbIk1JSUcyVENDQk1HZ0F3SUJBZ0lVSUdnQ2hQODlNTTJVdC9YRzhpSDdpNEpMYWhzd0RRWUpLb1pJaHZjTkFRRU5CUUF3Z2JFeElqQWdCZ05WQkFNTUdVUkpSMGxVUlV3Z1ZGTWdRVVJXUVU1RFJVUWdRMEVnUnpJeEVqQVFCZ05WQkFVVENVSTBOelEwTnpVMk1ERXJNQ2tHQTFVRUN3d2lSRWxIU1ZSRlRDQlVVeUJEUlZKVVNVWkpRMEZVU1U5T0lFRlZWRWhQVWtsVVdURW9NQ1lHQTFVRUNnd2ZSRWxIU1ZSRlRDQlBUaUJVVWxWVFZFVkVJRk5GVWxaSlEwVlRJRk5NVlRFVE1CRUdBMVVFQnd3S1ZtRnNiR0ZrYjJ4cFpERUxNQWtHQTFVRUJoTUNSVk13SGhjTk1qVXdNekkzTURnek5UTTJXaGNOTWpnd016STJNRGd6TlRNMVdqQ0JtekUyTURRR0ExVUVBd3d0VTJWaGJDQlRhV2R1WVhSMWNtVWdRM0psWkdWdWRHbGhiSE1nYVc0Z1UwSllJR1p2Y2lCMFpYTjBhVzVuTVJnd0ZnWURWUVFGRXc5V1FWUkZVeTFDTmpBMk5EVTVNREF4R0RBV0JnTlZCR0VNRDFaQlZFVlRMVUkyTURZME5Ua3dNREVNTUFvR0ExVUVDZ3dEU1U0eU1SSXdFQVlEVlFRSERBbENZWEpqWld4dmJtRXhDekFKQmdOVkJBWVRBa1ZUTUlJQklqQU5CZ2txaGtpRzl3MEJBUUVGQUFPQ0FROEFNSUlCQ2dLQ0FRRUFwSit6cEpPQnBCUzRtMUcwRkd6Ymx5WDRyQkp3bEM0WUxER2VKbHN4dkZpUXFzNDV2ZHNQYUdhMmNjaEl0aTNlTnlNWXI4SkU1aE9EUERneEY4bTViSGxxSTB1YVpCTnJaNXAxM3N2K0RwRjd1eVlNVXorQkl4dXQ4Ni9XdUYwdjlIM0pJbk1PTVN1STlIaWZ0aE11S25aeEc4NUEwU0ZhZllvL2xLTWR3akpKR2hJNkpYZit3YmVnemVIQVVHRDZmb2Z5Zm1IakxlZmcvVTNPYStnOVFNazNJT2syNzFISWloTkJXcHNjSzhnd1RPZTAyOFloQW12aTdEbENWNklVWnpDbjNSVTkxZHBtYjVOZkwwMUVzNG9ud2dXQjZ5YTJoR2J2ak4rd3ltSUFweG9JOVcrRE1wekJVazVtK1dDaUs4WnRNbE5KZXlnMnlDZ216TVlLOXdJREFRQUJvNElCK3pDQ0FmY3dEQVlEVlIwVEFRSC9CQUl3QURBZkJnTlZIU01FR0RBV2dCU0NFNkdqQXBUT1lnM2dCclkzVmtGd1hFV3VLekIwQmdnckJnRUZCUWNCQVFSb01HWXdQZ1lJS3dZQkJRVUhNQUtHTW1oMGRIQTZMeTl3YTJrdVpHbG5hWFJsYkhSekxtVnpMMFJKUjBsVVJVeFVVMUZWUVV4SlJrbEZSRU5CUnpFdVkzSjBNQ1FHQ0NzR0FRVUZCekFCaGhob2RIUndPaTh2YjJOemNDNWthV2RwZEdWc2RITXVaWE13Z2F3R0ExVWRJQVNCcERDQm9UQ0JuZ1lMS3dZQkJBR0RwMUVLQWdFd2dZNHdQd1lJS3dZQkJRVUhBZ0VXTTJoMGRIQnpPaTh2Y0d0cExtUnBaMmwwWld4MGN5NWxjeTlrY0dNdlJFbEhTVlJGVEZSVFgwUlFReTUyTWk0eExuQmtaakJMQmdnckJnRUZCUWNDQWpBL0REMURaWEowYVdacFkyRmtieUJqZFdGc2FXWnBZMkZrYnlCa1pTQnpaV3hzYnlCaGRtRnVlbUZrYnlCa1pTQndaWEp6YjI1aElHcDFjbWxrYVdOaE1BOEdDU3NHQVFVRkJ6QUJCUVFDQlFBd0hRWURWUjBsQkJZd0ZBWUlLd1lCQlFVSEF3SUdDQ3NHQVFVRkJ3TUVNRUlHQTFVZEh3UTdNRGt3TjZBMW9ET0dNV2gwZEhBNkx5OWpjbXd4TG5CcmFTNWthV2RwZEdWc2RITXVaWE12UkZSVFVYVmhiR2xtYVdWa1EwRkhNUzVqY213d0hRWURWUjBPQkJZRUZIOVV6QVlVZ1VzSHh1Rk5qY20vSzRLS1hSenJNQTRHQTFVZER3RUIvd1FFQXdJR3dEQU5CZ2txaGtpRzl3MEJBUTBGQUFPQ0FnRUFzdU8xMG9QdHJOMEFkc056MXErZ2lzMlZoVEYvM0E4TzkxL0o0R2dqNkhQM1VGa0pPQmRoRGsvWURlKytZSEo0M014d2kzZDJCeC92SHJnWDF3c25CVGwydUhmQ25xMDFZbWJla0s3TmZzbXlGc3R5blAxM3dsWm5SMGtvb0RUc3Z2aXFqRzliVlFWR0JoaDJqemFvMHMrRTJwM1gxUGhrNkRkZlNUTnBESklSL1Z3eTVBa0J0MWRoMjRvZjhKMjFVM3FVaWhDbmw0cVl6ZEkvcmV1Qi9lR25pMkc2Z0tlS2hzSUswejdzZkl6bGYrbW1wR0l2RFk4VExPV1dtWUttMHFEQTFDVU5tZ0tDdWZQa1V4dW92S3FxbXVKajhuZnJRL0hZSFh2UlJibktCVk0xZ2pmbnNmWURuaVRneUJxak8vK1U4UHZaOVZnVG04V2R5VjBFQ3h5YzVJMUV6ZDZtRHdROERaSGhjMWZ4Q2tnTGk4MGxPQ29zV1NseElORmExNWJIQjVIOGhtQTM3dmhxSzN6L3EwMW9VUTJiYnVqS3dpbFRXdXFhUUM0cGgrODkrRVY4UXNiM09nZWdtZElmZHBUWU5vS0M5YWNFZTJjbXh3MEhaK1RPamdqSHd0dWVYUTUyVUhIbTlncGpETllsNTFPSmU1NnpPZFQza2VJamtIcExKSGVYZHA5VnpaWnJGRVBySE14VzhaRkFjWDgweEkrM1EveXRqVnBZZlZUdkkwT2s5eXhuazh0R04xdFdiTVhOeTRENFhtUWlKMFhxR25DQWJNT2VGNDlzVld6RjRKNVY2Skpsa0U5eFZhU2s5eHRWOWxjcjlSenVTT1NYU0J4YlQwRHlnajJtMFFFT0taSzFYQ0ZmNllmRWxBd3o1dFltdU0rM2dZYz0iLCJNSUlHVlRDQ0JEMmdBd0lCQWdJVUU2cDNYV2FxVjh3aWRUMEdnRmVjcTlNYkhsNHdEUVlKS29aSWh2Y05BUUVOQlFBd2diRXhJakFnQmdOVkJBTU1HVVJKUjBsVVJVd2dWRk1nUVVSV1FVNURSVVFnUTBFZ1J6SXhFakFRQmdOVkJBVVRDVUkwTnpRME56VTJNREVyTUNrR0ExVUVDd3dpUkVsSFNWUkZUQ0JVVXlCRFJWSlVTVVpKUTBGVVNVOU9JRUZWVkVoUFVrbFVXVEVvTUNZR0ExVUVDZ3dmUkVsSFNWUkZUQ0JQVGlCVVVsVlRWRVZFSUZORlVsWkpRMFZUSUZOTVZURVRNQkVHQTFVRUJ3d0tWbUZzYkdGa2IyeHBaREVMTUFrR0ExVUVCaE1DUlZNd0hoY05NalF3TlRJNU1USXdNRFF3V2hjTk16Y3dOVEkyTVRJd01ETTVXakNCc1RFaU1DQUdBMVVFQXd3WlJFbEhTVlJGVENCVVV5QkJSRlpCVGtORlJDQkRRU0JITWpFU01CQUdBMVVFQlJNSlFqUTNORFEzTlRZd01Tc3dLUVlEVlFRTERDSkVTVWRKVkVWTUlGUlRJRU5GVWxSSlJrbERRVlJKVDA0Z1FWVlVTRTlTU1ZSWk1TZ3dKZ1lEVlFRS0RCOUVTVWRKVkVWTUlFOU9JRlJTVlZOVVJVUWdVMFZTVmtsRFJWTWdVMHhWTVJNd0VRWURWUVFIREFwV1lXeHNZV1J2Ykdsa01Rc3dDUVlEVlFRR0V3SkZVekNDQWlJd0RRWUpLb1pJaHZjTkFRRUJCUUFEZ2dJUEFEQ0NBZ29DZ2dJQkFNT1FhQkpHVW5Ldng0MEtaRDZFZXVZTVN4QUFjY3NIeU5KVzZxTW5rNjduT1BIQjk3Z2pSZ25zSnhlaFU4UVBneGhPYmhxN2tXYzAydlc4blFJUzJxeTcwSGpXK3k2SU1hT3RseWtzb05YT2N6UW9aQ25WcUJJaS9rRHNPaEZWMXJjRVhhaUJFVC9OdUlyU0t2R1lFSWR6QTlKYXFZZGZpL0pRL2xyWWF5RGZQM2Q3M2hzdXErbElqTjBkOWgrcEtjWXdML21JSWJLL2NRd2xsQVVtZGRyQXc5V0VtcWtsKzVSdURXcXBsRFdoaHZwR0pGUFh0NFJxS2dhYVZONVRVd1MyT0dKU05xQ3M2WkkrYVNkbmVUZ0NxcVEvLzgzaE45UXNtMG1CME44Tk85bHFTcENtUE9qWUdPVHA3SWs4aUI3dGV4MU9OeWVYTUhsOXpLRGNpcVYxNjJaUnBHdEptMnJ1ODZJVUNTalBsc3FUWE1uVzE0Mk1LdWdzVzNYNzFZMHF4M0RSVSszTHdnY0pxYU8xWS85RDJrUUVRSjN2NVplaUdRYXVSV3FmampBa0VSZ2grOG0zV1hYTHJuekFvRmhyUWRsQmExUTYxSTJVcWJxeGJBMGRTOUxkT3Q1K25GRlZabStFN0FBZVZ5cjhValZXVGRKUXZUTjN1cTBWa0wwbjJwcTAzK0hiNGdQUjh2cnBENzlKeWx5VWNJUjBRTklnTXRFRmU0ZUZKK2lDOSttYmVPanpIUWtsOFpHNTUxWDJLeTZzbDNPT25mOTNYZWRRRDB2RzByQ1lwUkdaKzUwazA1amx1S3pSamNpcUFDZ0xIQ0ZTcGNMeUJTS2dyWGNBMHFscFlEVEliZXg4OVR2UkdZMW5vd3JDNWxtR05UOGpKcnhDWU9ZREFnTUJBQUdqWXpCaE1BOEdBMVVkRXdFQi93UUZNQU1CQWY4d0h3WURWUjBqQkJnd0ZvQVVnaE9ob3dLVXptSU40QWEyTjFaQmNGeEZyaXN3SFFZRFZSME9CQllFRklJVG9hTUNsTTVpRGVBR3RqZFdRWEJjUmE0ck1BNEdBMVVkRHdFQi93UUVBd0lCaGpBTkJna3Foa2lHOXcwQkFRMEZBQU9DQWdFQUpHUUtyWjJVM0ovU3BHaFA3eldqdndlQlh4alc1dVNkeDBWN213djRtdkMyVmxDMVR2eEVuNXlWbmRFVUNwbEdwL20wUzNBMDdCdFBaMjRaU3VSdyttSXB0Qm1DaGJuVTF2ajJCRnBGRlRocHNRSkcwa0RqRDIzSG82cDNSdE1yaWI4SWkwUm5vVWJ3cFA1TjJMaWVPYnVvZDlPUzlxM01nQ2xoeTlGOTltT1d2RC9xNXZDVm8rdUxXWnVRNGFjdVRUTnhhNURIeWlqZ0IrR0dvMk9oSGxkclNwcCtMUmdVNWZrTktHMEx6aGxJRUdkRUJhbDBwdVovK1FxdFNyckxETVQ0WFBLV01KNmdwc3IzbFhmYmEwRWw3YmIvNzU2dE1ZQWJYem1ua2tVcWRpT0k1N3JWREZUOUZKeGpWZ281b1c4WE9LR1NMcU1IMzFYaUpDTm9INXJKWThWUTNabU1TdWg5N2tBQWhYdUZJYlFaN0Zya0YyeStHc0twYjBhOVpVcUZCckpsekh4Q0tsOFNTVHdmR0RnY3BlUFp4VUlJZ1BQY0k0b1h3Um9CMEhidDU0SXJSb0c3a1drNjhnWDJjaktWMFl0SG1WaEVFRnIzZGlaZk83bUFUQTU0c0xaWDluMWxvc25mOXhyZUV6ZEVZV2J5R1RoVXdsMzNNUDZYTGFGUlBkYm5Rc2hicm9lcHpnK25rc1U1VlZLMlpaRklXVlk2ZytSaElDWFZkaHFrQnBObStlSzArd1VDQTF0WFl5UktvU1VWcE1GU0FaaG5zeVVlWnphbVBIRGU0R2tUYW1NSzRxZlhLUU9iN0V0V1VXaDVmb1ZTemFxeXZGcHBVNFZNcC9nS3JQWUhENmJXckhKNXZDL0I3V3IvYVB0aE5rZ1hGTUdNclIwPSJdLCJ0eXAiOiJqb3NlIiwic2lnVCI6IjIwMjUtMDYtMjZUMDk6NDc6NDNaIiwiY3JpdCI6WyJzaWdUIl19.eyJzdWIiOiJkaWQ6a2V5OnpEbmFlUm5hbjU0bmN5RXZvRjJXNVRkMXNWcHlNcEhEV1FMV3RxdGlBWVRKdXBWTGYiLCJuYmYiOjE3MDQwOTYwMDAsImlzcyI6ImRpZDplbHNpOlZBVEVVLUI5OTk5OTk5OSIsImV4cCI6MTc2ODU3MTU4MSwiaWF0IjoxNzA0MDk2MDAwLCJ2YyI6eyJAY29udGV4dCI6WyJodHRwczovL3d3dy53My5vcmcvbnMvY3JlZGVudGlhbHMvdjIiLCJodHRwczovL3d3dy5ldmlkZW5jZWxlZGdlci5ldS8yMDIyL2NyZWRlbnRpYWxzL21hY2hpbmUvdjEiXSwiaWQiOiI0MWE5ZTI0Mi1jYTViLTRmYTktOGI5Yi02MDVkZGRmOWQ3ZDkiLCJ0eXBlIjpbIlZlcmlmaWFibGVDcmVkZW50aWFsIiwiTEVBUkNyZWRlbnRpYWxNYWNoaW5lIl0sImlzc3VlciI6eyJpZCI6ImRpZDplbHNpOlZBVEVTLUI2MDY0NTkwMCJ9LCJpc3N1YW5jZURhdGUiOiIyMDI0LTAxLTAxVDA4OjAwOjAwLjAwMDAwMDAwMFoiLCJ2YWxpZEZyb20iOiIyMDI0LTAxLTAxVDA4OjAwOjAwLjAwMDAwMDAwMFoiLCJ2YWxpZFVudGlsIjoiMjAyNy0wMS0wMVQwODowMDowMC4wMDAwMDAwMDBaIiwiZXhwaXJhdGlvbkRhdGUiOiIyMDI3LTAxLTMxVDIzOjU5OjAwLjAwMDAwMDAwMFoiLCJjcmVkZW50aWFsU3ViamVjdCI6eyJtYW5kYXRlIjp7ImlkIjoiN2EyYTcwNDQtNmZjMC00YjAyLTgwYjYtMmQ4YzBjZTZlZDdmIiwibGlmZV9zcGFuIjp7InN0YXJ0RGF0ZVRpbWUiOiIyMDI0LTAxLTAxVDA4OjAwOjAwLjAwMDAwMDAwMFoiLCJlbmREYXRlVGltZSI6IjIwMjYtMDEtMzFUMjM6NTk6MDAuMDAwMDAwMDAwWiJ9LCJtYW5kYXRlZSI6eyJpZCI6ImRpZDprZXk6ekRuYWVSbmFuNTRuY3lFdm9GMlc1VGQxc1ZweU1wSERXUUxXdHF0aUFZVEp1cFZMZiIsInNlcnZpY2VOYW1lIjoidGVzdE5hbWUiLCJzZXJ2aWNlVHlwZSI6InRlc3RUeXBlIiwidmVyc2lvbiI6IiIsImRvbWFpbiI6Imh0dHBzOi8vdmVyaWZpZXIuZG9tZS1tYXJrZXRwbGFjZS1kZXYyLm9yZyIsImlwQWRkcmVzcyI6IjIxNy4xNjAuMTM4LjQ3IiwiZGVzY3JpcHRpb24iOiJ0ZXN0IiwiY29udGFjdCI6eyJlbWFpbCI6ImRvbWVzdXBwb3J0QGluMi5lcyIsInBob25lIjoiKzM0OTk5OTk5OTk5In19LCJtYW5kYXRvciI6eyJjb21tb25OYW1lIjoiNTY1NjU2NTZQSmVzdXNSdWl6IiwiY291bnRyeSI6IkVTIiwiZW1haWxBZGRyZXNzIjoiamVzdXMucnVpekBpbjIuZXMiLCJvcmdhbml6YXRpb24iOiJJTjIsSW5nZW5pZXLDrWFkZWxhSW5mb3JtYWNpw7NuLFMuTC4iLCJvcmdhbml6YXRpb25JZGVudGlmaWVyIjoiVkFURVUtQjk5OTk5OTk5Iiwic2VyaWFsTnVtYmVyIjoiSURDRVMtNTY1NjU2NTZQIn0sInBvd2VyIjpbeyJpZCI6ImI3YzM3MGUxLTE0MzEtNDhkMS1iY2I5LTdjYTc5OTdhZGU3NyIsImRvbWFpbiI6IkRPTUUiLCJmdW5jdGlvbiI6IkxvZ2luIiwiYWN0aW9uIjoib2lkY19tMm0ifV0sInNpZ25lciI6eyJjb21tb25OYW1lIjoiU2VhbCBTaWduYXR1cmUgQ3JlZGVudGlhbHMgaW4gU0JYIGZvciB0ZXN0aW5nIiwiY291bnRyeSI6IkVTIiwiZW1haWxBZGRyZXNzIjoiamVzdXMucnVpekBpbjIuZXMiLCJvcmdhbml6YXRpb24iOiJJTjIiLCJvcmdhbml6YXRpb25JZGVudGlmaWVyIjoiVkFURVMtQjYwNjQ1OTAwIiwic2VyaWFsTnVtYmVyIjoiQjQ3NDQ3NTYwIn19fX0sImp0aSI6ImI0MGE0MTg4LTI0YjQtNDIyOS1hMWQ5LTZjMzI0ZTQyNzExOSJ9.DfRRI6kPr54kWzyys1qfQuuKLFtuyJMs6t4dBEgFSn8L_xYYevHFJq02VYhznTsRFuyO700K-gIFMIQ2_9nP9qLBUPlrQmwkmoIuHBiiQue9tVaDw9QxiS_1G__dic4Y0IbyUuGi1kvgUKHZfhrMQKU13zzynYQ571iLO9mBUPnMbH2CjQwfbTKHym02wx_v15gD5rtephlm7KaFL9DJtE-ekIbCOAE4WPjhI5jrpnFB-2AeSdng184ERW8kSVizo9HlKHCahcLFmbKsF_eVcno5p9cF4GawDv24HZsTfx5rsPGgMlN722kjjlh5UqwqWtRxfo65XZqq0CIhcIL4PA",
    credentialStatus: CredentialStatus.VALID,
    status: CredentialStatus.VALID
  }
  @Input() public isDetailViewActive = false;
  @Output() public vcEmit: EventEmitter<VerifiableCredential> =
    new EventEmitter();

  credentialType!: string;

  public cred_cbor = '';
  public isAlertOpenNotFound = false;
  public isAlertExpirationOpenNotFound = false;
  public isAlertOpenDeleteNotFound = false;
  public isExpired = false;
  public isModalOpen = false;
  public isModalDeleteOpen = false;
  public isModalUnsignedOpen = false;
  public showChip = false;
  public credentialStatus = CredentialStatus;
  public handlerMessage = '';
  public alertButtons = [
    {
      text: 'OK',
      role: 'confirm',
      handler: () => {
        this.handlerMessage = 'Alert confirmed';
        this.isModalOpen = true;
      },
    },
  ];

  public deleteButtons = [
    {
      text: 'Cancel',
      role: 'cancel',
      handler: () => {
        this.isModalDeleteOpen = false;
      },
    },
    {
      text: 'Yes, delete it',
      role: 'confirm',
      handler: () => {
        this.isModalDeleteOpen = true;
        this.vcEmit.emit(this.credentialInput);
      },
    },
  ];

  public unsignedButtons = [{
    text: 'Close',
    role: 'close',
    handler: () => {
      this.isModalUnsignedOpen = false;
    },
  },
  ];
  private readonly walletService = inject(WalletService);
  private readonly toastService = inject(ToastServiceHandler);

  public isDetailModalOpen = false;
  public evaluatedSections!: EvaluatedSection[];

  public openDetailModal(): void {
    if(this.isDetailViewActive){
      this.isDetailModalOpen = true;
      this.getStructuredFields();
    }
  }

  public closeDetailModal(): void {
    this.isDetailModalOpen = false;
  }

  public ngOnInit(): void {
    this.checkExpirationVC();
    this.checkAvailableFormats();
    this.credentialType = this.getSpecificType(this.credentialInput);
  }

  public getSpecificType(vc: VerifiableCredential): string {
    const [a, b] = vc.type ?? [];
    if (a === 'VerifiableCredential') {
      return b;
    } else if (b === 'VerifiableCredential') {
      return a;
    } else {
      return 'VerifiableCredential';
    }
  }

  public async copyToClipboard(text: string): Promise<void> {
    try {
      await navigator.clipboard.writeText(text);
      this.toastService.showToast('vc-fields.copy-success');
    } catch (err) {
      console.error('Error al copiar', err);
    }
  }


  // TO DO: funcion antigua, revisar si se puede eliminar
  public checkAvailableFormats(): void {
    /*this.showChip =
      this.credentialInput.available_formats?.includes('cwt_vc') ?? false;*/
  }

  public qrView(): void {
    if (!this.isExpired) {
      this.walletService.getVCinCBOR(this.credentialInput).subscribe({
        next: (value: string) => {
          this.cred_cbor = value;
          this.isAlertOpenNotFound = false;
        },
        error: (error: unknown) => {
          console.error('Error fetching VC in CBOR format:', error);
          this.isAlertOpenNotFound = true;
        },
      });
    } else {
      this.isAlertExpirationOpenNotFound = true;
    }
  }

  public deleteVC(): void {
    this.isModalDeleteOpen = true;
    this.isDetailModalOpen = false;
  }

  public unsignedInfo(): void {
    this.isModalUnsignedOpen = true;
  }

  public setOpen(isOpen: boolean): void {
    this.isModalOpen = isOpen;
  }

  public checkExpirationVC(): void {
    if (this.credentialInput.status !== CredentialStatus.ISSUED) {
      const validUntil: Date = new Date(
        this.credentialInput.validUntil
      );
      const currentDate: Date = new Date();
      this.isExpired = validUntil < currentDate;
    } else {
      this.isExpired = false;
    }
  }

  public setOpenNotFound(isOpen: boolean): void {
    this.isAlertOpenNotFound = isOpen;
  }

  public setOpenDeleteNotFound(isOpen: boolean): void {
    this.isAlertOpenDeleteNotFound = isOpen;
  }

  public setOpenExpirationNotFound(isOpen: boolean): void {
    this.isAlertExpirationOpenNotFound = isOpen;
  }

  public isCredentialIssuedAndNotExpired(): boolean {
    return (
      this.credentialInput.status === CredentialStatus.ISSUED
      && !this.isExpired
    );
  }

  public handleKeydown(event: KeyboardEvent, action = 'request') {
    if (event.key === 'Enter' || event.key === ' ') {
      if (action === 'qr') {
        this.qrView();
      } 
      event.preventDefault();
    }
  }

  public handleButtonKeydown(event: KeyboardEvent, action: string): void {
    if (event.key === 'Enter' || event.key === ' ') {
      if (action === 'delete') {
        this.deleteVC();
      } else if (action === 'close') {
        this.setOpen(false);
      } else if (action === 'info') {
        this.unsignedInfo();
      } else if (action === 'detail') {
        this.openDetailModal();
      }
      event.preventDefault();
    }
  }

  get typeConfig() {
    return CredentialTypeMap[this.credentialType];
  }

  get iconUrl(): string | undefined {
    return this.typeConfig?.icon;
  }

  get mappedFields(): { label: string; value: string }[] {
    const subject = this.credentialInput.credentialSubject;
    return this.typeConfig?.fields.map(f => ({
      label: f.label,
      value: f.valueGetter(subject),
    })) ?? [];
  }

  public getStructuredFields(): void {
    const cs = this.credentialInput.credentialSubject;
    const vc = this.credentialInput;

    const credentialInfo: EvaluatedSection = {
      section: 'vc-fields.title',
      fields: [
        { label: 'vc-fields.credentialInfo.context', value: Array.isArray(vc['@context']) ? vc['@context'].join(', ') : (vc['@context'] ?? '') },
        { label: 'vc-fields.credentialInfo.id', value: vc.id },
        { label: 'vc-fields.credentialInfo.type', value: Array.isArray(vc.type) ? vc.type.join(', ') : (vc.type ?? '') },
        { label: 'vc-fields.credentialInfo.name', value: vc.name ?? '' },
        { label: 'vc-fields.credentialInfo.description', value: vc.description ?? '' },
        { label: 'vc-fields.credentialInfo.issuerId', value: vc.issuer.id },
        { label: 'vc-fields.credentialInfo.issuerOrganization', value: vc.issuer.organization ?? '' },
        { label: 'vc-fields.credentialInfo.issuerCountry', value: vc.issuer.country ?? '' },
        { label: 'vc-fields.credentialInfo.issuerCommonName', value: vc.issuer.commonName ?? '' },
        { label: 'vc-fields.credentialInfo.issuerSerialNumber', value: vc.issuer?.serialNumber ?? '' },
        { label: 'vc-fields.credentialInfo.validFrom', value: this.formatDate(vc.validFrom) },
        { label: 'vc-fields.credentialInfo.validUntil', value: this.formatDate(vc.validUntil) }
      ].filter(field => !!field.value && field.value !== ''),
    };

    const entry = CredentialDetailMap[this.credentialType];
    const detailedSections: EvaluatedSection[] = typeof entry === 'function'
      ? entry(cs, vc).map(section => ({
          section: section.section,
          fields: section.fields
            .map(f => ({
              label: f.label,
              value: f.valueGetter(cs, vc),
            }))
            .filter(f => !!f.value && f.value !== ''),
        }))
      : (entry ?? []).map(section => ({
          section: section.section,
          fields: section.fields
            .map(f => ({
              label: f.label,
              value: f.valueGetter(cs, vc),
            }))
            .filter(f => !!f.value && f.value !== ''),
        }));

    if(this.credentialType == 'LearCredentialMachine') {
      detailedSections.push({
        section: 'vc-fields.lear-credential-machine.credentialEncoded',
        fields: [
          { label: 'vc-fields.lear-credential-machine.credentialEncoded', value: vc.credentialEncoded ?? '' }
        ]
      });

    }
    
    this.evaluatedSections = [credentialInfo, ...detailedSections].filter(section => section.fields.length > 0);
  }

  private formatDate(date: string | undefined): string {
    if (!date) {
      return ''; 
    }
    return dayjs(date).format('DD/MM/YYYY');
  }


}